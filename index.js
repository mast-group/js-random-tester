/**
 * Created by Pankajan on 21/07/2016.
 */
var util = require('./util.js');
var parser = require('./definitionParser');
var ranTestGen = require('./getMismatchLibraries');

//var file = 'aws-sdk';
//var module = require(file);
//var functionsList = parser.getFunctions(file, file);
//ranTestGen.executeRandomTest(file, functionsList);

var filesystem = require("fs");
filesystem.readdirSync('/Users/Pankajan/Edinburgh/Source/JSRandomTester/node_modules').forEach(function(file) {
    var stat = filesystem.statSync('/Users/Pankajan/Edinburgh/Source/JSRandomTester/node_modules'+'/'+file);
    if (stat && stat.isDirectory() && !file.startsWith('.') && file!=='d3') {
        try {
            console.log('File >>> ' + file);
            var functionsList = parser.getFunctions(file, file);
            ranTestGen.executeRandomTest(file, functionsList);
        } catch (err) {
            console.log(err.stack);
        }
    }
});

filesystem.appendFileSync('ranTests/RanTest.js', "console.log(success);\nconsole.log(fail);" +
    "\nconsole.log(correctType);\nconsole.log(wrongType);\nconsole.log(wrongDetails);\n" +
    "console.log(moduleCount.length);");



