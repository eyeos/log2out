var fs = require('fs');

function Log4JsConfigReader (env) {
	this.env = env || process.env;
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
		return JSON.parse(fs.readFileSync(filename, "utf8"));
	}
	return undefined;
};

module.exports = Log4JsConfigReader;
