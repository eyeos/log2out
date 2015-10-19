var fs = require('fs');

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

function getDefaultConfig () {
	return defaultLog4jsConfig
};

module.exports = {
	getDefaultConfig: getDefaultConfig
};
