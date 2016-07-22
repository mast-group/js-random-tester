/**
 * Util file to create random inputs and other helper methods
 * Created by Pankajan on 21/07/2016.
 */
const fs = require('fs');

module.exports = {
    randomInt: function (low, high)
    {
    return Math.floor(Math.random() * (high - low) + low);
    },


    randomBoolean: function () {
    return Math.random(10) < 5;
    },


    randomString: function () {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < Math.random(50); i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
    },


    getFiles: function (dir, recursive, options, files_){
        files_ = files_ || [];
        options = options || [];

        if(!dir.startsWith('.')) {
            var files = fs.readdirSync(dir);
            for (var i in files) {
                var currentFile = files[i];
                if (!currentFile.startsWith('.')) {
                    var name = dir + '/' + currentFile;
                    if (fs.statSync(name).isDirectory()) {
                        if (options.indexOf('includeFolders') !== -1 || options.indexOf('onlyFolders') !== -1) {
                            if(options.indexOf('onlyNames') !== -1)
                                files_.push(currentFile);
                            else
                                files_.push(name);
                        }
                        if (recursive) {
                            this.getFiles(name, recursive, options, files_);
                        }
                    } else if (options.indexOf('onlyFolders') === -1) {
                        if(options.indexOf('onlyNames') !== -1)
                            files_.push(currentFile);
                        else
                            files_.push(name);
                    }
                }
            }
        }
        return files_;
}


};