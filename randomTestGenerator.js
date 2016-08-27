/**
 * Created by Pankajan on 21/07/2016.
 */
var util = require('./util.js');
var parser = require('./definitionParser');

var functionsList = parser.getFunctions('underscore', 'underscore');
var module = require('underscore');

var libraryNames = util.getFiles('/Users/Pankajan/Edinburgh/Source/JSRandomTester/node_modules', false, ['includeFolders', 'onlyFolders', 'onlyNames']);

var accessibleProjects = 0;

for (var i in libraryNames) {
    try{
        var module_name = libraryNames[i].toLowerCase();
        if(module_name === 'backbone') {
            //console.log("processing " + module_name);
            try {
                module = require(module_name);

                accessibleProjects++;
            } catch (e) {
                console.log('Unable to parse ' + module_name)
            }
        }
    } catch (e) {

    }
}
printResults();

function printResults() {
    console.log('Total Projects : ' + libraryNames.length);
    console.log('Accessible Projects : ' + accessibleProjects);
}