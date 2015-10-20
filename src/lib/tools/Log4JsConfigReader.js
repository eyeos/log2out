var node_fs = require('fs');
var levels = require('../levels');

function Log4JsConfigReader (env, fs) {
	this.env = env || process.env;
	this.fs = fs || node_fs;
}

Log4JsConfigReader.prototype.getConfig = function () {
	return this._getLog4jsConfigFromEnvar() || {
			'levels': {
				'[all]': this.env.EYEOS_LOG_LEVEL || 'DEBUG'
			}
		};
};

Log4JsConfigReader.prototype._getLog4jsConfigFromEnvar = function () {
	var filename = this.env.LOG4JS_CONFIG;
	if (filename) {
		try {
			return JSON.parse(this.fs.readFileSync(filename, "utf8"));
		} catch (err) {
			console.log('[DEBUG] Log4JsConfigReader - specified LOG4JS_CONFIG (' + filename
						+ ') file does not (yet) exist or has invalid (not JSON) contents');
			return undefined;
		}
	}
	return undefined;
};

Log4JsConfigReader.prototype.getConfiguredLevel = function (loggerName) {
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
