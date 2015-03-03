'use strict';

var format = require('util').format;

function doLog(level, name, separator){
    if (! level) {
        level = '';
    }
    if (! name) {
        name = '';
    }
    var extraArgs = Array.prototype.slice.call(arguments, 3);
    var traceTxt = format.apply(null, extraArgs);
    var timestamp = '[' + new Date().toISOString() + ']';

    console.log(timestamp, level, name, separator, traceTxt);
}

var ConsoleLog = function(name, settings) {
    if (!settings) {
        throw new Error('ConsoleLog settings object is mandatory.')
    }

    return {
        name: name,
        debug: doLog.bind(null, settings.levels.DEBUG, name, settings.separator),
        info: doLog.bind(null, settings.levels.INFO, name, settings.separator),
        warn: doLog.bind(null, settings.levels.WARN, name, settings.separator),
        error: doLog.bind(null, settings.levels.ERROR, name, settings.separator)
    }
};

module.exports = ConsoleLog;