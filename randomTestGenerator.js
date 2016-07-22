/**
 * Created by Pankajan on 21/07/2016.
 */
var util = require('./util.js');

definitionFiles = util.getFiles('/Users/Pankajan/Edinburgh/Source/DefinitelyTyped', false, ['includeFolders', 'onlyFolders', 'onlyNames']);

var exec = require('child_process').exec,
    child;

var totalProjects = 0;
var accessibleProjects = 0;

for (var i in definitionFiles) {
    totalProjects++;
    var module_name = definitionFiles[i].toLowerCase();

    child = exec('npm install ' + module_name,
        function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error === null) {
                //Success scenario
                var module;
                try {
                    module = require(module_name);
                    accessibleProjects++;
                } catch (e) {
                    console.log('Unable to parse ' + module_name)
                }
            }
        });
}

console.log('Total Projects : '+ totalProjects);
console.log('Accessible Projects : '+ accessibleProjects);
