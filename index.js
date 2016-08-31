/**
 * Created by Pankajan on 21/07/2016.
 */
var util = require('./util.js');
var parser = require('./definitionParser');
var ranTestGen = require('./randomTestGenerator');

//var file = 'big.js';
//var module = require(file);
//var functionsList = parser.getFunctions(file, file);
//ranTestGen.executeRandomTest(file, functionsList);

var filesystem = require("fs");
filesystem.readdirSync('/Users/Pankajan/Edinburgh/Source/JSRandomTester/node_modules').forEach(function(file) {
    var stat = filesystem.statSync('/Users/Pankajan/Edinburgh/Source/JSRandomTester/node_modules'+'/'+file);
    if (stat && stat.isDirectory() && !file.startsWith('.')) {
        try {
            console.log('File >>> ' + file);
            var functionsList = parser.getFunctions(file, file);
            ranTestGen.executeRandomTest(file, functionsList);
        } catch (err) {
            console.log(err.stack);
        }
    }
});


