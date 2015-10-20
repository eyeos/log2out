'use strict';

var format = require('util').format;

var levels = require('../levels');

var ConsoleLog = function ConsoleLog (loggerName, settings, levelName, FormaterFactory) {
	if (!(this instanceof ConsoleLog)) {
		return new ConsoleLog(loggerName, settings, levelName);
	}

	if (!settings) {
		throw new Error('ConsoleLog settings object is mandatory.')
	}

	this.loggerName = loggerName || '';
	this.settings = settings;

	this.setLevelName(levelName);

	this.FormaterFactory = FormaterFactory || require('../formaters/FormaterFactory');
	this.formater = null;
};

ConsoleLog.prototype.setLevelName = function (levelName) {
	var settings = this.settings;
	levelName = levelName || 'DEBUG';
	this.level = levels[levelName.toUpperCase()] === undefined ? levels.DEBUG : levels[levelName.toUpperCase()];

	this.trace = this.level <= levels.TRACE ? doLog.bind(this, settings.levels.TRACE, this.loggerName, settings.separator) : doNothing;
	this.debug = this.level <= levels.DEBUG ? doLog.bind(this, settings.levels.DEBUG, this.loggerName, settings.separator) : doNothing;
	this.info = this.level <= levels.INFO ? doLog.bind(this, settings.levels.INFO, this.loggerName, settings.separator) : doNothing;
	this.warn = this.level <= levels.WARN ? doLog.bind(this, settings.levels.WARN, this.loggerName, settings.separator) : doNothing;
	this.error = this.level <= levels.ERROR ? doLog.bind(this, settings.levels.ERROR, this.loggerName, settings.separator) : doNothing;
	this.fatal = this.level <= levels.FATAL ? doLog.bind(this, settings.levels.FATAL, this.loggerName, settings.separator) : doNothing;
};

function doLog (levelTxt, loggerName, separator) {
	if (!levelTxt) {
		levelTxt = '';
	}
	if (!loggerName) {
		loggerName = '';
	}
	var extraArgs = Array.prototype.slice.call(arguments, 3);
	if (this.formater) {
		var text = this.formater.format(levelTxt, loggerName, extraArgs);
		console.log(text);
	} else {
		var traceTxt = format.apply(null, extraArgs);
		var timestamp = '[' + new Date().toISOString() + ']';
		console.log(timestamp, levelTxt, loggerName, separator, traceTxt);
	}

};

function doNothing () {
};


ConsoleLog.prototype.setFormater = function (formater) {
	this.formater = this.FormaterFactory.getInstance(formater);
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
