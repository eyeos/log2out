var TransactionFormater = function(timestamp) {
    this.timestamp = timestamp || require('internet-timestamp');
};

TransactionFormater.prototype.format = function(level, name) {
    var message = Array.prototype.slice.call(arguments, 2, arguments.length - 2);
    var tid = arguments[arguments.length - 2];
    var sid = arguments[arguments.length - 1];
    return this.timestamp(new Date()) + '|' + level + '|TID=' + tid + '|SID=' + sid + '| ' + message.join(' ');
};

module.exports = TransactionFormater;