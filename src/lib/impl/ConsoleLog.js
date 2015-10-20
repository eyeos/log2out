'use strict';

var format = require('util').format;

var levels = {
	TRACE: 0,
	DEBUG: 1,
	INFO: 2,
	WARN: 3,
	ERROR: 4,
	FATAL: 5,
	OFF: 6
};

var ConsoleLog = function ConsoleLog (loggerName, settings, log4jsSettings, FormatterFactory) {
	if (!(this instanceof ConsoleLog)) {
		return new ConsoleLog(loggerName, settings, log4jsSettings);
	}

	if (!settings) {
		throw new Error('ConsoleLog settings object is mandatory.')
	}

	this.loggerName = loggerName || '';

	this.level = calculateLevel(this.loggerName, log4jsSettings);

	this.trace = this.level <= levels.TRACE ? doLog.bind(this, settings.levels.TRACE, this.loggerName, settings.separator) : doNothing;
	this.debug = this.level <= levels.DEBUG ? doLog.bind(this, settings.levels.DEBUG, this.loggerName, settings.separator) : doNothing;
	this.info = this.level <= levels.INFO ? doLog.bind(this, settings.levels.INFO, this.loggerName, settings.separator) : doNothing;
	this.warn = this.level <= levels.WARN ? doLog.bind(this, settings.levels.WARN, this.loggerName, settings.separator) : doNothing;
	this.error = this.level <= levels.ERROR ? doLog.bind(this, settings.levels.ERROR, this.loggerName, settings.separator) : doNothing;
	this.fatal = this.level <= levels.FATAL ? doLog.bind(this, settings.levels.FATAL, this.loggerName, settings.separator) : doNothing;

	this.FormatterFactory = FormatterFactory || require('../formatters/FormatterFactory');
	this.formatter = null;
};

function doLog (levelTxt, loggerName, separator) {
	if (!levelTxt) {
		levelTxt = '';
	}
	if (!loggerName) {
		loggerName = '';
	}
	var extraArgs = Array.prototype.slice.call(arguments, 3);
	if (this.formatter) {
		var text = this.formatter.format(levelTxt, loggerName, extraArgs);
		console.log(text);
	} else {
		var traceTxt = format.apply(null, extraArgs);
		var timestamp = '[' + new Date().toISOString() + ']';
		console.log(timestamp, levelTxt, loggerName, separator, traceTxt);
	}

};

function doNothing () {
};

function calculateLevel (loggerName, log4jsSettings) {
	if (!log4jsSettings) {
		return levels.DEBUG;
	}
	if (log4jsSettings.levels && log4jsSettings.levels[loggerName]) {
		var levelForThis = log4jsSettings.levels[loggerName].toUpperCase();
		return (levels[levelForThis] == null) ? levels.DEBUG : levels[levelForThis];
	}
	if (log4jsSettings.levels && log4jsSettings.levels['[all]']) {
		var levelForThis = log4jsSettings.levels['[all]'].toUpperCase();
		return (levels[levelForThis] == null) ? levels.DEBUG : levels[levelForThis];
	}
	return levels.DEBUG;
}

ConsoleLog.prototype.setFormatter = function (formatter) {
	this.formatter = this.FormatterFactory.getInstance(formatter);
};

ConsoleLog.prototype.getLevel = function () {
	return this.level;
};

ConsoleLog.prototype.getLevelName = function () {
	for (var levelName in levels) {
		if (levels[levelName] === this.level) {
			return levelName;
		}
	}
};

module.exports = ConsoleLog;
