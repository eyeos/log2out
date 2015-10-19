var FormaterFactory = {

	getInstance: function (formater) {
		var Formater = require('./' + formater);
		var formater = new Formater();
		return formater;
	}

};

module.exports = FormaterFactory;
