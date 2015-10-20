var sinon = require('sinon');
var assert = require('chai').assert;

var TransactionFormatter = require('../lib/formatters/TransactionFormatter');

suite('TransactionFormatter', function () {
	var sut;
	var timestamp, level, name, message1, message2, message3, tid, sid;
	var timestampStub;

	setup(function () {
		timestamp = '2013-03-14T19:16:19-07:00';
		level = 'INFO';
		name = 'KarmaFactory';
		message1 = 'user:';
		message2 = 'marc.monge';
		message3 = 'Login success!';
		tid = '550e8400-e29b-41d4-a716-446655440000';
		sid = '550e8400-e29b-41d4-a716-446655441234';
		timestampStub = sinon.stub();
		sut = new TransactionFormatter(timestampStub);
	});

	suite('format', function () {

		test('When called with correct parameters should return correctly formatted text', function () {
			var expectedText = timestamp + '|' + level + '|TID=' + tid + '|SID=' + sid + '| ' + message3;
			timestampStub.returns(timestamp);
			var actualText = sut.format(level, name, [message3, tid, sid]);
			assert.equal(expectedText, actualText, 'Invalid formatted text');
		});

		test('When called with correct parameters should return correctly formatted text even if the message is in more than one parameter', function () {
			var expectedText = timestamp + '|' + level + '|TID=' + tid + '|SID=' + sid + '| ' + message1 + ' ' + message2 + ' ' + message3;
			timestampStub.returns(timestamp);
			var actualText = sut.format(level, name, [message1, message2, message3, tid, sid]);
			assert.equal(expectedText, actualText, 'Invalid formatted text');
		});

	});
});
