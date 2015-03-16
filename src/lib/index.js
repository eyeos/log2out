'use strict';

var ConsoleLog = require('./impl/ConsoleLog');
var DummyLog = require('./impl/DummyLog');
var fs = require('fs');

var defaultSettings = {
    levels: {
		TRACE: '[TRACE]',
        INFO: '[INFO]',
        DEBUG: '[DEBUG]',
        WARN: '[WARN]',
        ERROR: '[ERROR]',
		FATAL: '[FATAL]'
    },
    separator: '-'
};

function getLog4jsConfigFromEnvar() {
    var filename = process.env.LOG4JS_CONFIG;
    if (filename) {
        return JSON.parse(fs.readFileSync(filename, "utf8"));
    }
    return undefined;
}

var defaultLog4jsConfig = getLog4jsConfigFromEnvar() || {
        'levels': {
            '[all]': 'DEBUG'
        }
};

var returnDummyLogger = false;

function getLogger(name, settings, log4jsConfig){
    if (! settings) {
        settings = defaultSettings;
    }
    if (! log4jsConfig) {
        log4jsConfig = defaultLog4jsConfig;
    }

    if (returnDummyLogger) {
        return DummyLog(name);
    }
    return ConsoleLog(name, settings, log4jsConfig);
}

function clearAppenders() {
    returnDummyLogger = true;
}

function enableAppenders() {
    returnDummyLogger = false;
}

module.exports.getLogger = getLogger;
module.exports.settings = defaultSettings;
module.exports.clearAppenders = clearAppenders;
module.exports.enableAppenders = enableAppenders;

