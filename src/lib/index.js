'use strict';

var ConsoleLog = require('./impl/ConsoleLog');
var DummyLog = require('./impl/DummyLog');
var Log4jsConfigReader = require('./tools/Log4JsConfigReader');

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

function getLogger (name, settings, levelName, log4jsConfigReader) {
	log4jsConfigReader = log4jsConfigReader || new Log4jsConfigReader(name);

	if (!settings) {
		settings = defaultSettings;
	}
	if (!levelName) {
		levelName = log4jsConfigReader.getConfiguredLevel();
	}

	if (returnDummyLogger) {
		return DummyLog(name);
	}
	var logger = ConsoleLog(name, settings, levelName);

	log4jsConfigReader.on('logLevelChanged', function (newLogLevel) {
		logger.setLevelName(newLogLevel);
	});

	return logger;
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
