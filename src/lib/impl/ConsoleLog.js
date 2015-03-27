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

var ConsoleLog = function ConsoleLog(name, settings, log4jsSettings, FormaterFactory) {
    if (!(this instanceof ConsoleLog)) {
        return new ConsoleLog(name, settings, log4jsSettings);
    }

    if (!settings) {
        throw new Error('ConsoleLog settings object is mandatory.')
    }

    this.name = name || '';

    this.level = this.calculateLevel(name, log4jsSettings);

	this.trace = this.level <= levels.TRACE ? doLog.bind(this, settings.levels.TRACE, name, settings.separator) : doNothing;
    this.debug = this.level <= levels.DEBUG ? doLog.bind(this, settings.levels.DEBUG, name, settings.separator) : doNothing;
    this.info  = this.level <= levels.INFO  ? doLog.bind(this, settings.levels.INFO,  name, settings.separator) : doNothing;
    this.warn  = this.level <= levels.WARN  ? doLog.bind(this, settings.levels.WARN,  name, settings.separator) : doNothing;
    this.error = this.level <= levels.ERROR ? doLog.bind(this, settings.levels.ERROR, name, settings.separator) : doNothing;
	this.fatal = this.level <= levels.FATAL ? doLog.bind(this, settings.levels.FATAL, name, settings.separator) : doNothing;

    this.FormaterFactory = FormaterFactory || require('../formaters/FormaterFactory');
    this.formater = null;
};

function doLog(levelTxt, name, separator){
    if (! levelTxt) {
        levelTxt = '';
    }
    if (! name) {
        name = '';
    }
    var extraArgs = Array.prototype.slice.call(arguments, 3);
    if (this.formater) {
        var text = this.formater.format(levelTxt, name, extraArgs);
        console.log(text);
    } else {
        var traceTxt = format.apply(null, extraArgs);
        var timestamp = '[' + new Date().toISOString() + ']';
        console.log(timestamp, levelTxt, name, separator, traceTxt);
    }

};

function doNothing(){};

ConsoleLog.prototype.calculateLevel = function(name, log4jsSettings) {
    if (! log4jsSettings) {
        return levels.DEBUG;
    }
    if (log4jsSettings.levels && log4jsSettings.levels[name]) {
        var levelForThis = log4jsSettings.levels[name].toUpperCase();
        return (levels[levelForThis] == null)? levels.DEBUG: levels[levelForThis];
    }
    if (log4jsSettings.levels && log4jsSettings.levels['[all]']) {
        var levelForThis = log4jsSettings.levels['[all]'].toUpperCase();
		return (levels[levelForThis] == null)? levels.DEBUG: levels[levelForThis];
    }
    return levels.DEBUG;
};

ConsoleLog.prototype.setFormater = function(formater) {
    this.formater = this.FormaterFactory.getInstance(formater);
};

ConsoleLog.prototype.getLevel = function() {
    return this.level;
};

ConsoleLog.prototype.getLevelName = function () {
    for (var levelName in levels) {
       if(levels[levelName] === this.level) {
           return levelName;
       }
    }
};

module.exports = ConsoleLog;
