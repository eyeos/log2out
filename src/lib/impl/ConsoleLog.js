'use strict';

var format = require('util').format;

var levels = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERR: 3
};

function doLog(levelTxt, name, separator){
    if (! levelTxt) {
        levelTxt = '';
    }
    if (! name) {
        name = '';
    }
    var extraArgs = Array.prototype.slice.call(arguments, 3);
    var traceTxt = format.apply(null, extraArgs);
    var timestamp = '[' + new Date().toISOString() + ']';

    console.log(timestamp, levelTxt, name, separator, traceTxt);
}

var ConsoleLog = function ConsoleLog(name, settings, log4jsSettings) {
    if (!(this instanceof ConsoleLog)) {
        return new ConsoleLog(name, settings, log4jsSettings);
    }

    if (!settings) {
        throw new Error('ConsoleLog settings object is mandatory.')
    }

    this.name = name || '';

    this.debug = doLog.bind(this, settings.levels.DEBUG, name, settings.separator);
    this.info = doLog.bind(this, settings.levels.INFO, name, settings.separator);
    this.warn = doLog.bind(this, settings.levels.WARN, name, settings.separator);
    this.error = doLog.bind(this, settings.levels.ERROR, name, settings.separator);

    this.level = this.calculateLevel(name, log4jsSettings);
};

ConsoleLog.prototype.calculateLevel = function(name, log4jsSettings) {
    if (! log4jsSettings) {
        return levels['DEBUG'];
    }
    if (log4jsSettings.levels && log4jsSettings.levels[name]) {
        var levelForThis = log4jsSettings.levels[name].toUpperCase();
        return levels[levelForThis] || levels['DEBUG'];
    }
    if (log4jsSettings.levels && log4jsSettings.levels['[all]']) {
        var levelForThis = log4jsSettings.levels['[all]'].toUpperCase();
        return levels[levelForThis] || levels['DEBUG'];
    }
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