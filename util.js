/**
 * Util file to create random inputs and other helper methods
 * Created by Pankajan on 21/07/2016.
 */
const fs = require('fs');

module.exports = {
    isObjectEmpty: function (obj) {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    },

    randomNumber: function (low, high)
    {
        if(high)
            return Math.random() * (high - low) + low;
        else
            return Math.random() * low;
    },

    randomInt: function (low, high)
    {
        return Math.floor(this.randomNumber(low, high));
    },

    randomBoolean: function () {
        return Math.random(10) < 5;
    },

    randomString: function (includeQuotes) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < this.randomInt(20); i++)
        text += possible.charAt(this.randomInt(possible.length));
    return text;
    },

    randomAny: function () {
        var ran = this.randomInt(3);
        var retVal;
        if(ran===0)
            retVal =  this.randomBoolean();
        else if(ran===1)
            retVal =  this.randomNumber(10);
        else
            retVal = this.randomString(true);
        return retVal;
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