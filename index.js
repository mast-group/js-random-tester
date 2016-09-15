/**
 * Created by Pankajan on 21/07/2016.
 */
var DFTYPE_ROOT = '/Users/Pankajan/Edinburgh/Source/DefinitelyTyped/';
var INSTALLED_LIB_ROOT = '/Users/Pankajan/Edinburgh/Source/JSRandomTester/node_modules';

var util = require('./util.js');
var parser = require('./definitionParser');
var ranTestGen = require('./getNewVersionDTFile');

var file = 'azure-mobile-apps';
var dfFilePath = DFTYPE_ROOT + file + '/' + file + '.d.ts';
var newSource = ranTestGen.createNewVersionDTFile(file, dfFilePath);

//var module = require(file);
//var functionsList = parser.getFunctions(file, file);
//ranTestGen.executeRandomTest(file, functionsList);

var filesystem = require("fs");
filesystem.readdirSync(INSTALLED_LIB_ROOT).forEach(function(file) {
    var stat = filesystem.statSync(INSTALLED_LIB_ROOT+'/'+file);
    if (stat && stat.isDirectory() && !file.startsWith('.') && file!=='d3') {
        try {
            var dfFilePath = DFTYPE_ROOT + file + '/' + file + '.d.ts';
            console.log('File >>> ' + file);
            ranTestGen.createNewVersionDTFile(file, dfFilePath);
        } catch (err) {
            console.log(err.stack);
        }
    }
});

//filesystem.appendFileSync('ranTests/RanTest.js', "console.log(success);\nconsole.log(fail);" +
//    "\nconsole.log(correctType);\nconsole.log(wrongType);\nconsole.log(wrongDetails);\n" +
//    "console.log(moduleCount.length);");



