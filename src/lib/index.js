'use strict';

var ConsoleLog = require('./impl/ConsoleLog');

var defaultSettings = {
    levels: {
        INFO: '[INFO]',
        DEBUG: '[DEBUG]',
        WARN: '[WARN]',
        ERROR: '[ERROR]'
    },
    separator: '-'
};

function getLogger(name, settings){
    if (! settings) {
        settings = defaultSettings;
    }
    return new ConsoleLog(name, settings);
}

module.exports.getLogger = getLogger;
module.exports.settings = defaultSettings;