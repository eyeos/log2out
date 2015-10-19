var node_fs = require('fs');

function Log4JsConfigReader (env, fs) {
	this.env = env || process.env;
	this.fs = fs || node_fs;
}

Log4JsConfigReader.prototype.getDefaultConfig = function () {
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

module.exports = Log4JsConfigReader;
