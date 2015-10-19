var fs = require('fs');

function Log4JsConfigReader () {

}

Log4JsConfigReader.prototype.getDefaultConfig = function () {
	return this._getLog4jsConfigFromEnvar() || {
			'levels': {
				'[all]': process.env.EYEOS_LOG_LEVEL || 'DEBUG'
			}
		};
};

	var filename = process.env.LOG4JS_CONFIG;
Log4JsConfigReader.prototype._getLog4jsConfigFromEnvar = function () {
	if (filename) {
		return JSON.parse(fs.readFileSync(filename, "utf8"));
	}
	return undefined;
};

module.exports = Log4JsConfigReader;
