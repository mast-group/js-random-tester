/**
 * Created by Pankajan on 21/07/2016.
 */
var util = require('./util.js');
var fs = require('fs');

function bootstrapRandomTesting(moduleName) {
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
                    generateRandomArguments(methods[i].arguments);
                }
            }
        }
    } else if(definitionStructure.isMethod){
        //Library is either contains only one method which is exposed or should create an object using a construtor before using it.
        var methods = definitionStructure.methods;
        if(methods===undefined) {
            console.log();
        } else {
            if(methods.length>1) {
                console.log();
            }
            for (var i = 0; i < methods.length; i++) {
                var methodName = methods[i].name;
                if(isValidArguments(methods[i].arguments)) {
                    generateRandomArguments(methods[i].arguments);
                }
            }
        }
    } else if(definitionStructure.constructors.length>0) {
        if(definitionStructure.methods.length>0) {
            for(i=0; i<definitionStructure.constructors.length;i++) {
                var curConst = definitionStructure.constructors[i];
                if(isValidArguments(curConst.arguments)) {
                    generateRandomArguments(curConst.arguments);
                    for(j=0;j<definitionStructure.methods.length;j++) {
                        if(isValidArguments(definitionStructure.methods[j].arguments)) {
                            generateRandomArguments(definitionStructure.methods[j].arguments);
                            if(definitionStructure.methods[j].isStatic) {

                            } else {

                            }
                        }
                    }
                }
            }
        }
    } else if(definitionStructure.methods.length>0) {
        if(definitionStructure.methods.length===1) {
            generateRandomArguments(definitionStructure.methods[0].arguments);
        } else {
            for(j=0;j<definitionStructure.methods.length;j++) {
                generateRandomArguments(definitionStructure.methods[j].arguments);
            }
        }
        console.log();
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

}

function generateRandomArguments(arguments) {
    var argumentsCode='';
    for(var i=0; i<arguments.length; i++){
        var optional = arguments[i].optional;
        randomValueForArgumentBuilder(arguments[i]);
    }
}

function randomValueForArgumentBuilder(argument) {
    if(argument.type!==undefined){
        generateValuesForArgument(argument.type, argument);
    }
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
        valueCount = util.randomInt(50);
        argumentValue = [];
        for(var i=0;i<valueCount;i++) {
            if(type.properties.type===undefined){
                console.log();
            }
            argumentValue.push(generateValuesForArgument(type.properties.type, argument))
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
                argumentValue = util.randomNumber(1000);
            } else if (type.properties.kind==='string') {
                argumentValue = util.randomString();
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
                    if(definitionStructure.classes[i].name===type.properties.kind) {
                        objAvailable = true;
                        argumentValue = {};
                        var props = definitionStructure.classes[i].properties;
                        for(var key in props) {
                            if (props.hasOwnProperty(key)) {
                                argumentValue[key] = generateValuesForArgument(props[key].type);
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
        if(arguments[i]===undefined || arguments[i].type.function) isValid=false;
    }
    return isValid;
}

var genTestCode;
var definitionStructure;
module.exports = {
    executeRandomTest: function (moduleName, df) {
        definitionStructure = df;
        if(definitionStructure) {
            genTestCode = "var module = require ('" + moduleName + "');\n";
            //fs.writeFileSync('ranTests/'+moduleName+'RanTest.js', newCode);
            /**
             * , function (err) {
            if (err) console.log(err.stack);
            console.log("The file was saved!");
        }
             */
            return bootstrapRandomTesting(moduleName);
        }
    }
};


