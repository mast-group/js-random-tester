/**
 * Created by Pankajan on 11/09/2016.
 */
var parser = require('./definitionParser');
var ranTestGen = require('./randomTestGenerator');
var ts = require('typescript');
var fs = require('fs');

var defFilePath;
var projectName;
var definitionStructure;
var source;
var removingIndexes = [];
var addingMethods = {};

function checkMethod(object, method, isFunction) {
    if(object!==undefined && method!==undefined) {
        if (isFunction) {
            if (!(typeof object === 'function' || object[method.name] !== undefined)) {
                removeCodeSegment(method.pos, method.end);
            }
        } else if (object[method.name] === undefined) {
            removeCodeSegment(method.pos, method.end);
        }
    }
}

function removeCodeSegment(start, end) {
    //if(removingIndexes.indexOf(start)===-1)
        removingIndexes.push(start);
    //if(removingIndexes.indexOf(end)===-1)
        removingIndexes.push(end);
}

function checkNewMethods(object, methods, isStatic) {
    for (var prop in object) {
        if(object.hasOwnProperty(prop)) {
            currentProperty = object[prop];
            if(typeof currentProperty === 'function') {
                var methodName = currentProperty.name;
                if(methodName===undefined || methodName==='') {methodName = prop;}
                var variableName = {};
                var methodExists = false;
                for(var i=0; i<methods.length; i++) {
                    for(var j=0; j<methods[i].arguments.length;j++) {
                        variableName[methods[i].arguments[j].name] = methods[i].arguments[j].type.rawName
                    }
                    if(currentProperty.name===undefined || currentProperty.name==='') {
                        if(methods[i].name===prop) {
                            methodExists = true;
                        }
                    } else if(methods[i].name===currentProperty.name) {
                        methodExists = true;
                    }
                }
                if(!methodExists && methodName!==undefined) {
                    var lastMethodDetected = false;
                    j=methods.length-1;
                    while(!lastMethodDetected && j>=0){
                        if(removingIndexes.indexOf(methods[j].end)===-1) {
                            var curKey = source.substring(ts.skipTrivia(source, methods[j].pos), methods[j].end);
                            if(addingMethods.hasOwnProperty(curKey)) {
                                if(addingMethods[curKey].indexOf(methodName)===-1) {
                                    addingMethods[curKey] = addingMethods[curKey] +
                                        getNewMethod(methodName, currentProperty, variableName, isStatic);
                                }
                            } else {
                                addingMethods[curKey] =
                                    getNewMethod(methodName, currentProperty, variableName, isStatic);
                            }
                            lastMethodDetected = true;
                        }
                        j--;
                    }
                }
            }
        }
    }
}

var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func) {
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if(result === null)
        result = [];
    return result;
}

function getNewMethod(methodName, method, existingNames, isStatic) {
    var params = getParamNames(method);
    var methodBuilder = methodName + '(';
    if(isStatic) {methodBuilder = 'static ' + methodBuilder};
    for (var i=0; i<params.length;i++){
        var name = existingNames.hasOwnProperty(params[i]) ? existingNames[params[i]] : 'any';
        methodBuilder += params[i] + ': ' + name;
        if(i<params.length-1) {methodBuilder += ','}
    }
    return '\n' + methodBuilder + '): any;\n';
}

function generateNewSource() {
    var buildSource;
    if(removingIndexes.length>0) {
        removingIndexes.sort(function (a, b) {
            return a - b;
        });
        buildSource = source.substring(0, removingIndexes[0]);
        for (var i = 1; i < removingIndexes.length; i = i + 2) {
            buildSource += source.substring(removingIndexes[i], removingIndexes[i + 1]);
        }
    } else {
        buildSource = source;
    }

    for (var prop in addingMethods) {
        if (addingMethods.hasOwnProperty(prop)) {
            var index = buildSource.indexOf(prop);
            if(index!==-1) {
                index += prop.length;
                buildSource = buildSource.substring(0, index) + addingMethods[prop] + buildSource.substring(index);
            }
        }
    }

    return buildSource;
}
function bootstrapRandomTesting(moduleName) {
    var mName = moduleName.replace(/-/g, "").replace(/\./g, "");
    var createdTestSource = '';
    var executingModule = require(moduleName);
    /**
     * Check if current eecuting library is loaded as an object. In that case, all public api will be in that object and no need to create any objects
     */
    if (typeof executingModule === 'object') {
        //Library initialized a object so we can directly access methods
        var methods = definitionStructure.methods;
        if (methods === undefined) {
            console.log();
        } else {
            for (var i = 0; i < methods.length; i++) {
                if (ranTestGen.isValidArguments(methods[i].arguments)) {
                    var kind = undefined;
                    var isArray = undefined;
                    if (ranTestGen.validReturnType(methods[i].returnType)) {
                        kind = methods[i].returnType.properties.kind;
                        isArray = methods[i].returnType.array;
                    }
                    checkMethod(executingModule, methods[i]);
                }
            }
            checkNewMethods(executingModule, methods);
        }
    }
    /**
     * If isMethod property is true in the retrieved structure of ts definition, then at least one method is available to call by default from library without using any method name (like library(params))
     */
    else if (definitionStructure.isMethod && definitionStructure.methods !== undefined) {
        //Library is either contains only one method which is exposed or should create an object using a construtor before using it.
        methods = definitionStructure.methods;
        for (i = 0; i < methods.length; i++) {
            //TODO if new keyword is in method add it.
            checkMethod(executingModule, methods[i], true);
        }
        checkNewMethods(executingModule, methods);
    }
    /**
     * Constructors available means, we have to create an object before use the library
     */
    else if (definitionStructure.constructors.length > 0) {
        if (definitionStructure.methods.length > 0) {
            for (i = 0; i < definitionStructure.constructors.length; i++) {
                var curConst = definitionStructure.constructors[i];
                if (ranTestGen.isValidArguments(curConst.arguments)) {
                    skipModules = ['big.js', 'axios', 'jquery', 'moment'];

                    var moduleObj;
                    var createdObj = true;
                    if (skipModules.indexOf(moduleName) !== -1) {
                        moduleObj = executingModule;
                        //createdTestSource += 'var '+ mName+ 'Obj = ' + mName + ';\n';
                    } else {
                        try {
                            moduleObj = executingModule.apply(ranTestGen.generateRandomArgumentsArray(curConst.arguments));
                            //createdTestSource += wrapTryCatch('var '+ mName+ 'Obj = new ' + mName + generateRandomArguments(curConst.arguments) + ";");
                        } catch (err) {
                            createdObj = false;
                        }
                    }
                    if (createdObj) {
                        /**
                         * load available methods to execute by looking into the retrieved definition structure.
                         */
                        if (skipModules.indexOf(moduleName) !== -1 || curConst.returnType === 'void') {
                            var curMethods = definitionStructure.methods;
                        } else {
                            curMethods = [];
                            for (j = 0; j < definitionStructure.classes.length; j++) {
                                if (curConst.returnType.properties !== undefined &&
                                    typeof curConst.returnType.properties.kind === "string" &&
                                    curConst.returnType.properties.kind.toLowerCase() === definitionStructure.classes[j].name.toLowerCase()) {
                                    curMethods = definitionStructure.classes[j].methods;
                                }
                            }
                        }
                        for (j = 0; j < curMethods.length; j++) {
                            if (ranTestGen.isValidArguments(curMethods[j].arguments)) {
                                methodName = curMethods[j].name;
                                if (curMethods[j].isStatic) {
                                    kind = undefined;
                                    isArray = undefined;
                                    if (ranTestGen.validReturnType(curMethods[j].returnType)) {
                                        kind = curMethods[j].returnType.properties.kind;
                                        isArray = curMethods[j].returnType.array;
                                    }
                                    checkMethod(executingModule, curMethods[j]);
                                    //createdTestSource += wrapTryCatch(kind, isArray, "variableName = " + mName + '.' + methodName + generateRandomArguments(curMethods[j].arguments) + ";");
                                } else {
                                    kind = undefined;
                                    isArray = undefined;
                                    if (ranTestGen.validReturnType(curMethods[j].returnType)) {
                                        kind = curMethods[j].returnType.properties.kind;
                                        isArray = curMethods[j].returnType.array;
                                    }
                                    checkMethod(moduleObj, curMethods[j]);
                                    //createdTestSource += wrapTryCatch(kind, isArray, "variableName = " + mName + 'Obj.' + methodName + generateRandomArguments(curMethods[j].arguments) + ";");
                                }
                            }
                        }
                        checkNewMethods(executingModule, curMethods, true);
                        checkNewMethods(moduleObj, curMethods);
                    }
                }
            }
        }
    } else if (definitionStructure.methods.length > 0) {
        if (definitionStructure.methods.length === 1) {
            kind = undefined;
            isArray = undefined;
            if (ranTestGen.validReturnType(definitionStructure.methods[0].returnType)) {
                kind = definitionStructure.methods[0].returnType.properties.kind;
                isArray = definitionStructure.methods[0].returnType.array;
            }
            checkMethod(executingModule, methods[0], true);
            checkNewMethods(executingModule, methods);
            //createdTestSource += wrapTryCatch(kind, isArray, "variableName = " + mName + generateRandomArguments(definitionStructure.methods[0].arguments) + ";");
        } else {
            for (j = 0; j < definitionStructure.methods.length; j++) {
                kind = undefined;
                isArray = undefined;
                if (ranTestGen.validReturnType(definitionStructure.methods[j].returnType)) {
                    kind = definitionStructure.methods[j].returnType.properties.kind;
                    isArray = definitionStructure.methods[j].returnType.array;
                }
                checkMethod(executingModule, definitionStructure.methods[j]);
                //createdTestSource += wrapTryCatch(kind, isArray, "variableName = " + mName + '.' + definitionStructure.methods[j].name + generateRandomArguments(definitionStructure.methods[j].arguments) + ";");
            }
            checkNewMethods(executingModule, definitionStructure.methods);
        }
    } else if (definitionStructure.classes.length === 1) {
        processSingleClass(definitionStructure.classes[0], executingModule);
        var selectedClass = definitionStructure.classes[0];
        moduleObj = executingModule;
        if(definitionStructure.classes[0].constructors.length > 0) {
            moduleObj = executingModule.apply(ranTestGen.generateRandomArgumentsArray(definitionStructure.classes[0].constructors[0].arguments));
        }
        for (j = 0; j < selectedClass.methods.length; j++) {
            checkMethod(moduleObj, selectedClass.methods[j]);
            //generateRandomArguments(selectedClass.methods[j].arguments);
        }
        checkNewMethods(moduleObj, selectedClass.methods[j]);
    } else {
        var processed = false;
        i = 0;
        while (i < definitionStructure.classes.length && !processed) {
            if (moduleName.toLowerCase() === definitionStructure.classes[i].name.toLowerCase()) {
                selectedClass = definitionStructure.classes[i];
                for (j = 0; j < selectedClass.methods.length; j++) {
                    processSingleClass(selectedClass, executingModule);
                    //generateRandomArguments(selectedClass.methods[j].arguments);
                }
                processed = true;
            }
            i++;
        }
        if (!processed) {
            selectedClass = undefined;
            var maxMethods = 0;
            for (i = 0; i < definitionStructure.classes.length; i++) {
                if (definitionStructure.classes[i].constructors.length > 0) {
                    if (definitionStructure.classes[i].methods.length > maxMethods) {
                        maxMethods = definitionStructure.classes[i].methods.length;
                        selectedClass = definitionStructure.classes[i];
                    }
                    processed = true;
                }
            }
            if (selectedClass) {
                processSingleClass(selectedClass, executingModule);
            }
        }
        if (!processed) {
            console.log();
        }
    }
    return createdTestSource;
}

function processSingleClass(selectedClass, executingModule) {
    var moduleObj = executingModule;
    if(definitionStructure.classes[0].constructors.length > 0) {
        moduleObj = executingModule.apply(ranTestGen.generateRandomArgumentsArray(definitionStructure.classes[0].constructors[0].arguments));
    }
    for (j = 0; j < selectedClass.methods.length; j++) {
        checkMethod(moduleObj, selectedClass.methods[j]);
        //generateRandomArguments(selectedClass.methods[j].arguments);
    }
    checkNewMethods(moduleObj, selectedClass.methods[j]);
}

function loadDefFile(moduleName, defFilePath) {
    definitionStructure = parser.getFunctions(moduleName, defFilePath);
    source = String(fs.readFileSync(defFilePath));
    projectName = moduleName;
}

function saveNewSourceFile() {
    console.log();
}

function createNewVersionDTFile(moduleName, dfPath) {
    loadDefFile(moduleName, dfPath);
    if (definitionStructure) {
        ranTestGen.setDefinitionStructure(definitionStructure);
        bootstrapRandomTesting(moduleName);
        return generateNewSource();
    }
}
module.exports = {
    createNewVersionDTFile: createNewVersionDTFile
};

if (!module.parent) {
    // this is the main module
    var args = process.argv.slice(2);
    if(args.length!==2) {
        console.log('Usage: <moduleName> <definitionFilepath>');
    } else {
        var newSource = createNewVersionDTFile(args[0], args[1]);
        var newFilePath;
        if(args.length===2) {
            var path = require('path');
            var fileName = path.basename(args[1]);
            fileName = fileName.substring(0, fileName.indexOf('.d.ts')) + '_new.d.ts';
            newFilePath = path.join(path.dirname(args[1]), fileName);
        } else
            newFilePath = args[2];
        fs.writeFileSync(newFilePath, newSource);
    }
}
