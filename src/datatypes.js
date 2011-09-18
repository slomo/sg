var filename = process.argv[2];
var crypto = require('crypto');
var fs = require('fs');

var getSha = function(data) {
    var shasum = crypto.createHash('sha1');
    shasum.update(data);
    return shasum.digest('hex');
}

module.exports = {
    
    cell : function(x,y) {
        return {
            pos : { x:x, y:y},
            installedProg : "",
            owner : "",
            storageKey : "cell:" + x + ":" + y,
            units : 0,
            msgOut : [],
            msgIn : [],
        };
    },

    player : function(id,name) {
        return {
            id : id,
            name : name,
        };
    },

    prog : function(source) {
        sha = getSha(source);
        return {
            id : sha,
            source : source,
            storageKey : "prog:" +  sha,
        };
    }

}


