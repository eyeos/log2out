'use strict';

var ConsoleLog = require('./impl/ConsoleLog');
var DummyLog = require('./impl/DummyLog');
var Log4jsConfigReader = require('./tools/Log4JsConfigReader');

var log4jsConfigReader = new Log4jsConfigReader();

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

var returnDummyLogger = false;

function getLogger (name, settings, log4jsConfig) {
	if (!settings) {
		settings = defaultSettings;
	}
	if (!log4jsConfig) {
		log4jsConfig = log4jsConfigReader.getDefaultConfig();
	}

	if (returnDummyLogger) {
		return DummyLog(name);
	}
	return ConsoleLog(name, settings, log4jsConfig);
}

function clearAppenders () {
	returnDummyLogger = true;
}

function enableAppenders () {
	returnDummyLogger = false;
}

module.exports.getLogger = getLogger;
module.exports.settings = defaultSettings;
module.exports.clearAppenders = clearAppenders;
module.exports.enableAppenders = enableAppenders;
