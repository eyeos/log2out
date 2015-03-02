'use strict';

function getLogger(){
    return {
        debug: function(){console.log(arguments)}
    }
}

module.exports.getLogger = getLogger;