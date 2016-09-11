/**
 * Created by Pankajan on 21/07/2016.
 */
var util = require('./util.js');
var parser = require('./definitionParser');
var ranTestGen = require('./randomTestGenerator');
var sutil = require('line-stream-util');

var filesystem = require("fs");
filesystem.readdirSync('/Users/Pankajan/Edinburgh/Source/JSRandomTester/node_modules').forEach(function(file) {
    var stat = filesystem.statSync('/Users/Pankajan/Edinburgh/Source/JSRandomTester/node_modules'+'/'+file);
    var dfFile = '/Users/Pankajan/Edinburgh/Source/DefinitelyTyped/'+ file + '/' + file + '.d.ts';

    if (stat && stat.isDirectory() && !file.startsWith('.') && filesystem.existsSync(dfFile)) {
        try {
            var pjson = require(file + '/package.json');

            //console.log(pjson.version);
            filesystem.createReadStream(dfFile)
                .pipe(sutil.head(1)) // get head lines
                .pipe(sutil.split())
                .setEncoding('utf8')
                .on('data', function(data){
                    var matches = data.match(/\d+/g);
                    if (matches != null) {
                        console.log(data);
                        console.log(pjson.version);
                    }

                });

        } catch (err) {
            console.log(err.stack);
        }
    }
});



