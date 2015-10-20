var TransactionFormatter = function (timestamp) {
	this.timestamp = timestamp || require('internet-timestamp');
};

TransactionFormatter.prototype.format = function (level, name, extraArgs) {
	var message = Array.prototype.slice.call(extraArgs, 0, extraArgs.length - 2);
	var tid = extraArgs[extraArgs.length - 2];
	var sid = extraArgs[extraArgs.length - 1];
	return this.timestamp(new Date()) + '|' + level + '|TID=' + tid + '|SID=' + sid + '| ' + message.join(' ');
};

module.exports = TransactionFormatter;
