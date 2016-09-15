/**
 * Created by Pankajan on 21/07/2016.
 */
var util = require('./util.js');
var fs = require('fs');

function bootstrapRandomTesting(moduleName) {
    var mName = moduleName.replace(/-/g, "").replace(/\./g,"");
    var createdTestSource = '';
    var executingModule = require(moduleName);
    if(typeof executingModule === 'object') {
        //Library initialized a object so we can directly access methods
        var methods = definitionStructure.methods;
        if(methods===undefined) {
            console.log();
        } else {
            for (var i = 0; i < methods.length; i++) {
                var methodName = methods[i].name;
                if(isValidArguments(methods[i].arguments)) {
                    var kind = undefined; var isArray = undefined;
                    if(validReturnType(methods[i].returnType)) {
                        kind = methods[i].returnType.properties.kind;
                        isArray = methods[i].returnType.array;
                    }
                    createdTestSource += wrapTryCatch(kind, isArray, "variableName = " + mName + '.' +methodName + generateRandomArguments(methods[i].arguments) + ";");
                }
            }
        }
    } else if(definitionStructure.isMethod && definitionStructure.methods !==undefined){
        //Library is either contains only one method which is exposed or should create an object using a construtor before using it.
        methods = definitionStructure.methods;

        if(methods.length===1) {
            kind = undefined; isArray = undefined;
            if(validReturnType(methods[0].returnType)) {
                kind = methods[0].returnType.properties.kind;
                isArray = methods[0].returnType.array;
            }
            createdTestSource += wrapTryCatch(kind, isArray, "variableName = " + mName  + generateRandomArguments(methods[0].arguments) + ";");
        } else {
            for (i = 0; i < methods.length; i++) {
                methodName = methods[i].name;
                if (isValidArguments(methods[i].arguments)) {
                    kind = undefined; isArray = undefined;
                    if(validReturnType(methods[i].returnType)) {
                        kind = methods[i].returnType.properties.kind;
                        isArray = methods[i].returnType.array;
                    }
                    createdTestSource += wrapTryCatch(kind, isArray, "variableName = " + mName + '.' + methodName + generateRandomArguments(methods[i].arguments) + ";");
                }
            }
        }

    } else if(definitionStructure.constructors.length>0) {
        if(definitionStructure.methods.length>0) {
            for(i=0; i<definitionStructure.constructors.length;i++) {
                var curConst = definitionStructure.constructors[i];
                if(isValidArguments(curConst.arguments)) {
                    skipModules = ['big.js', 'axios', 'jquery', 'moment'];
                    if(skipModules.indexOf(moduleName) !== -1) {
                        createdTestSource += 'var '+ mName+ 'Obj = ' + mName + ';\n';
                    } else {
                        createdTestSource += wrapTryCatch('var '+ mName+ 'Obj = new ' + mName + generateRandomArguments(curConst.arguments) + ";");
                    }
                    if(skipModules.indexOf(moduleName) !== -1|| curConst.returnType==='void') {
                        var curMethods = definitionStructure.methods;
                    } else {
                        curMethods = [];
                        for(j=0; j<definitionStructure.classes.length;j++) {
                            if (curConst.returnType.properties!== undefined &&
                                typeof curConst.returnType.properties.kind === "string" &&
                                curConst.returnType.properties.kind.toLowerCase() === definitionStructure.classes[j].name.toLowerCase()) {
                                curMethods = definitionStructure.classes[j].methods;
                            }
                        }
                    }
                    for(j=0;j<curMethods.length;j++) {
                        if(isValidArguments(curMethods[j].arguments)) {
                            methodName = curMethods[j].name;
                            if(curMethods[j].isStatic) {
                                kind = undefined; isArray = undefined;
                                if(validReturnType(curMethods[j].returnType)) {
                                    kind = curMethods[j].returnType.properties.kind;
                                    isArray = curMethods[j].returnType.array;
                                }
                                createdTestSource += wrapTryCatch(kind, isArray, "variableName = " + mName + '.' +methodName + generateRandomArguments(curMethods[j].arguments) + ";");
                            } else {
                                kind = undefined; isArray = undefined;
                                if(validReturnType(curMethods[j].returnType)) {
                                    kind = curMethods[j].returnType.properties.kind;
                                    isArray = curMethods[j].returnType.array;
                                }
                                createdTestSource += wrapTryCatch(kind, isArray, "variableName = " + mName + 'Obj.' +methodName + generateRandomArguments(curMethods[j].arguments) + ";");
                            }
                        }
                    }
                }
            }
        }
    } else if(definitionStructure.methods.length>0) {
        if(definitionStructure.methods.length===1) {
            kind = undefined; isArray = undefined;
            if(validReturnType(definitionStructure.methods[0].returnType)) {
                kind = definitionStructure.methods[0].returnType.properties.kind;
                isArray = definitionStructure.methods[0].returnType.array;
            }
            createdTestSource += wrapTryCatch(kind, isArray, "variableName = " + mName + generateRandomArguments(definitionStructure.methods[0].arguments) + ";");
        } else {
            for(j=0;j<definitionStructure.methods.length;j++) {
                kind = undefined; isArray = undefined;
                if(validReturnType(definitionStructure.methods[j].returnType)) {
                    kind = definitionStructure.methods[j].returnType.properties.kind;
                    isArray = definitionStructure.methods[j].returnType.array;
                }
                createdTestSource += wrapTryCatch(kind, isArray, "variableName = " + mName + '.' + definitionStructure.methods[j].name + generateRandomArguments(definitionStructure.methods[j].arguments) + ";");

            }
        }
    } else if(definitionStructure.classes.length===1) {
        var selectedClass = definitionStructure.classes[0];
        for(j=0;j<selectedClass.methods.length;j++) {
            generateRandomArguments(selectedClass.methods[j].arguments);
        }
    } else {
        var processed = false;
        i=0;
        while(i<definitionStructure.classes.length && !processed) {
            if(moduleName.toLowerCase() === definitionStructure.classes[i].name.toLowerCase()) {
                selectedClass = definitionStructure.classes[i];
                for(j=0;j<selectedClass.methods.length;j++) {
                    generateRandomArguments(selectedClass.methods[j].arguments);
                }
                processed = true;
            }
            i++;
        }
        if(!processed) {
            selectedClass = undefined;
            var maxMethods = 0;
            for(i=0; i<definitionStructure.classes.length; i++) {
                if(definitionStructure.classes[i].constructors.length>0) {
                    if(definitionStructure.classes[i].methods.length > maxMethods) {
                        maxMethods = definitionStructure.classes[i].methods.length;
                        selectedClass = definitionStructure.classes[i];
                    }
                    processed = true;
                }
            }
            if(selectedClass) {
                for(j=0;j<selectedClass.methods.length;j++) {
                    generateRandomArguments(selectedClass.methods[j].arguments);
                }
            }
        }
        if(!processed) {
            console.log();
        }
    }
    return createdTestSource;
}

function generateRandomArguments(arguments) {
    argumentsArray = generateRandomArgumentsArray(arguments);
    var argumentsCode='( ';
    for(var i=0; i<argumentsArray.length; i++) {
        argumentsCode += JSON.stringify(argumentsArray[i]);
        if(i<argumentsArray.length-1) argumentsCode += ", ";
    }
    return argumentsCode + " )";
}


function generateRandomArgumentsArray(arguments) {
    var argumentsArray=[];
    for(var i=0; i<arguments.length; i++){
        var optional = arguments[i].optional;
        if(optional) {
            if(util.randomBoolean() && !arguments[i].type.function) {
                argumentsArray.push(generateValuesForArgument(arguments[i].type, arguments[i]));
            } else {
                i= arguments.length-1;
            }
        } else {
            argumentsArray.push(generateValuesForArgument(arguments[i].type, arguments[i]));
        }
    }
    return argumentsArray;
}


function generateValuesForArgument(type, argument){
    var valueCount = 1;
    var argumentValue;

    if(type.object===true){
        console.log();
        argumentValue = {};
        for(var key in type.properties.type) {
            if (type.properties.type.hasOwnProperty(key)) {
                if(type.properties.type[key]===undefined){
                    console.log();
                }
                argumentValue[key] = generateValuesForArgument(type.properties.type[key], argument);
            }
        }
    } else if(type.array===true){
        valueCount = util.randomInt(10);
        argumentValue = [];
        for(var i=0;i<valueCount;i++) {
            if(type.properties.type===undefined){
                console.log();
            }
            argumentValue.push(generateValuesForArgument(type.properties.type, argument));
        }
    } else if(type.function===true){
        //Omitting function for now since creating function objects is a hard task.
        //TODO: implement random generation of function objects
        argumentValue = 'function() {}';
    } else if(type.paranthesis===true){
        argumentValue = generateValuesForArgument(type.properties.type, argument);
    } else if(type.predicate===true){
        console.log();
    } else{
        if(typeof type.properties.kind === 'object') {
            console.log();
        } else {
            if (type.properties.kind==='number') {
                argumentValue = util.randomNumber(10);
            } else if (type.properties.kind==='string') {
                argumentValue = util.randomString(true);
            } else if (type.properties.kind==='boolean') {
                argumentValue = util.randomBoolean();
            } else if (type.properties.kind==='any') {
                argumentValue = util.randomAny();
            } else if (type.properties.kind === 'union'){
                var unionTypes = type.properties.type;
                var randomUnionType = unionTypes[util.randomInt(unionTypes.length-1)];
                if(randomUnionType!==undefined){
                    argumentValue = generateValuesForArgument(randomUnionType);
                }
            } else if (typeof type.properties.kind === 'string'){
                var objAvailable = false;
                for(i=0;i<definitionStructure.classes.length; i++) {
                    if(type.properties.kind==='BigNum') {
                        argumentValue = util.randomInt(10);
                        objAvailable = true;
                    } else {
                        if (definitionStructure.classes[i].name === type.properties.kind) {
                            objAvailable = true;
                            argumentValue = {};
                            var props = definitionStructure.classes[i].properties;
                            for (var key in props) {
                                if (props.hasOwnProperty(key)) {
                                    argumentValue[key] = generateValuesForArgument(props[key].type);
                                }
                            }
                        }
                    }
                }

                if(!objAvailable) {
                    for(var prop in definitionStructure.types) {
                        if(definitionStructure.types.hasOwnProperty(prop)) {
                            console.log();
                            if(prop===type.properties.kind ) {
                                argumentValue = generateValuesForArgument(definitionStructure.types[prop][util.randomInt(definitionStructure.types[prop].length)]);
                            }

                        }
                    }
                }

                if(!objAvailable)
                    console.log();
            } else {
                console.log();
            }
        }

    }
    return argumentValue;
}

function isValidArguments(arguments) {
    var isValid = true;
    for(var i=0; i<arguments.length;i++) {
        if(arguments[i]===undefined || arguments[i].type === undefined || arguments[i].type.function) isValid=false;
    }
    return isValid;
}

function wrapTryCatch(kind, isArray, newCode) {
    var typeCheck ='';
    if(isArray!== undefined &&  kind !== undefined) {
        if(isArray) {
            typeCheck = "if(Array.isArray(variableName) && typeof variableName === '" + kind +"')"
        } else {
            typeCheck = "if(typeof variableName === '" + kind +"')"
        }
        typeCheck += " {correctType++;}\nelse{wrongType++;" +
            "wrongDetails+=\"" + newCode.replace(/"/g, "'") + " : Type should be : " + kind + " found : \"+typeof variableName+\"\\n\"}";
    }
    return 'try{\n' +newCode + "\nsuccess++;\nmoduleCount['" + mName + "'] = 1;\n"+ typeCheck +"} catch(err) { console.log(err.stack); fail++;}\n"
}

function validReturnType(returnType) {
    return returnType.properties.kind=== 'number' || returnType.properties.kind==='string' || returnType.properties.kind==="boolean";
}

function setDefinitionStructure(ds) {
    definitionStructure = ds;
}

var genTestCode;
var definitionStructure;
var mName;
module.exports = {
    executeRandomTest: function (moduleName, df) {
        definitionStructure = df;
        mName = moduleName;
        if(definitionStructure) {
            genTestCode = "\n\nvar "+ moduleName.replace(/-/g, "").replace(/\./g,"") + " = require ('" + moduleName + "');\n";
            //fs.writeFileSync('ranTests/'+moduleName+'RanTest.js', newCode);
            /**
             * , function (err) {
            if (err) console.log(err.stack);
            console.log("The file was saved!");
        }
             */
            fs.appendFileSync('ranTests/RanTest.js', genTestCode + bootstrapRandomTesting(moduleName));
        }
    },
    setDefinitionStructure: setDefinitionStructure,
    isValidArguments: isValidArguments,
    validReturnType: validReturnType,
    generateRandomArgumentsArray: generateRandomArgumentsArray
};


