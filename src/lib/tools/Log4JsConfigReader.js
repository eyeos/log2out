var fs = require('fs');

function Log4JsConfigReader () {

}

Log4JsConfigReader.prototype.getDefaultConfig = function () {
	return defaultLog4jsConfig
};

function getLog4jsConfigFromEnvar () {
	var filename = process.env.LOG4JS_CONFIG;
	if (filename) {
		return JSON.parse(fs.readFileSync(filename, "utf8"));
	}
	return undefined;
}

var defaultLog4jsConfig = getLog4jsConfigFromEnvar() || {
		'levels': {
			'[all]': process.env.EYEOS_LOG_LEVEL || 'DEBUG'
		}
	};

module.exports = Log4JsConfigReader;
