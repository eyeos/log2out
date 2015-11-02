"use strict";

var node_fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var levels = require('../levels');

function Log4JsConfigReader (loggerName, env, fs, mkdirpSync) {
	var self = this;
	this.loggerName = loggerName;
	this.env = env || process.env;
	this.fs = fs || node_fs;
	this.mkdirpSync = mkdirpSync || mkdirp.sync;
	this.filename = this.env['LOG4JS_CONFIG'];
	if (this.filename) {
		// we will watch the LOG4JS_CONFIG file for modifications to be able to change the loglevel
		// on the fly. We are watching the parent folder (and creating it) because the file may not
		// exist and you can not watch a non-existing filename. So, we need to watch the parent and
		// only react when we have an event on the right filename. Btw, this alignment it's so cool
		var folder = path.dirname(this.filename);
		this.mkdirpSync(folder);
		this.fs.watch(folder, {persistent: false}, function (event, filename) {
			if (filename == path.basename(self.filename)) {
				self.configFileChangeHandler.call(self);
			}
		});
	}
}

// inherit from EventEmitter to emit events (duh...)
Log4JsConfigReader.prototype = Object.create(require('events').EventEmitter.prototype);

Log4JsConfigReader.prototype.getConfig = function () {
	return this._getLog4jsConfigFromEnvar() || {
			'levels': {
				'[all]': this.env.EYEOS_LOG_LEVEL || 'DEBUG'
			}
		};
};

Log4JsConfigReader.prototype.configFileChangeHandler = function () {
	// as they may be multiple inotify events for a single action (when
	// overwriting a file you get 2 events), and as you may get the 'changed'
	// event even before it has finished, we wait a little and discard pending
	// events if we receive a new one.
	var self = this;
	clearTimeout(this.timeoutId);
	this.timeoutId = setTimeout(function () {
		self.emit('logLevelChanged', self.getConfiguredLevel.call(self));
	}, 1000);
};

Log4JsConfigReader.prototype._getLog4jsConfigFromEnvar = function () {
	if (this.filename) {
		try {
			return JSON.parse(this.fs.readFileSync(this.filename, "utf8"));
		} catch (err) {
			//console.log('[DEBUG] Log4JsConfigReader - specified LOG4JS_CONFIG (' + this.filename
			//			+ ') file does not (yet) exist or has invalid (not JSON) contents');
			return undefined;
		}
	}
	return undefined;
};

Log4JsConfigReader.prototype.getConfiguredLevel = function () {
	var loggerName = this.loggerName;
	var defaultLevel = "DEBUG";

	var log4jsSettings = this.getConfig();

	if (!log4jsSettings) {
		return defaultLevel;
	}
	if (log4jsSettings.levels && log4jsSettings.levels[loggerName]) {
		var levelForThis = log4jsSettings.levels[loggerName].toUpperCase();
		return (levels[levelForThis] == null) ? defaultLevel : levelForThis;
	}
	if (log4jsSettings.levels && log4jsSettings.levels['[all]']) {
		var levelForThis = log4jsSettings.levels['[all]'].toUpperCase();
		return (levels[levelForThis] == null) ? defaultLevel : levelForThis;
	}
	return defaultLevel;
};

module.exports = Log4JsConfigReader;
