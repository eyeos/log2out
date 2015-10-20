var FormatterFactory = {

	getInstance: function (formatter) {
		var Formatter = require('./' + formatter);
		var formatter = new Formatter();
		return formatter;
	}

};

module.exports = FormatterFactory;
