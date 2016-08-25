/**
 * Created by Pankajan on 24/07/2016.
 */
/**
 * Created by Pankajan on 21/07/2016.
 */
var util = require('./util.js');

var allDefinitionFiles = util.getFiles('/Users/Pankajan/Edinburgh/Source/DefinitelyTyped', false, ['includeFolders', 'onlyFolders', 'onlyNames']);
var existingFiles = util.getFiles('/Users/Pankajan/Edinburgh/Source/JSRandomTester/node_modules', false, ['includeFolders', 'onlyFolders', 'onlyNames']);
var definitionFiles = allDefinitionFiles.slice(allDefinitionFiles.indexOf(existingFiles[existingFiles.length-1])+1, allDefinitionFiles.length);

var exec = require('child_process').exec,
    child;

var i=0;
var length = definitionFiles.length -1 ;

var myVar = setInterval(myTimer, 15000);

function myTimer() {
    if(i==length) {
        clearInterval(myVar);
    }
    try{
        var module_name = definitionFiles[i].toLowerCase();
        i++;
        //if (module_name.startsWith("o")) {
        console.log("processing " + module_name);
        child = exec('npm install ' + module_name,
            function (error, stdout, stderr) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error === null) {
                    //Success scenario
                }
            });
        //}
    } catch (e) {

    }

}
