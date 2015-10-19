'use strict';

var sinon = require('sinon');
var assert = require('chai').assert;

suite('log2out.getLogger.', function () {
	var sut;
	setup(function () {
		var log2out = require('../lib/index');
		sut = log2out.getLogger;
	});

	suite('#getLogger returns a logger.', function () {

		test('logger object has a trace method', function () {
			var logger = sut();

			assert.property(logger, 'trace');
			assert.isFunction(logger.trace);
		});

		test('logger object has a debug method', function () {
			var logger = sut();

			assert.property(logger, 'debug');
			assert.isFunction(logger.debug);
		});

		test('logger object has an info method', function () {
			var logger = sut();

			assert.property(logger, 'info');
			assert.isFunction(logger.info);
		});

		test('logger object has a warn method', function () {
			var logger = sut();

			assert.property(logger, 'warn');
			assert.isFunction(logger.warn);
		});

		test('logger object has an error method', function () {
			var logger = sut();

			assert.property(logger, 'error');
			assert.isFunction(logger.error);
		});

		test('logger object has a fatal method', function () {
			var logger = sut();

			assert.property(logger, 'fatal');
			assert.isFunction(logger.fatal);
		});

		test('logger has a name', function () {
			var aName = 'mylogger';

			var logger = sut(aName);

			assert.equal(logger.name, aName);
		});

		test('logger object is unique for each call', function () {
			var aName = 'mylogger';

			var firstLogger = sut(aName);
			var secondLogger = sut(aName);

			assert.notEqual(firstLogger, secondLogger);
		});

	});

	suite('#getLogger and clearAppenders.', function () {
		var sut;
		var DummyLogger = require('../lib/impl/DummyLog');

		setup(function () {
			var log2out = require('../lib/index');
			sut = log2out;
		});

		teardown(function () {
			sut.enableAppenders();
		});

		test('getLogger should NOT return DummyLog when clearAppenders is NOT called', function () {
			var aName = 'mylogger';

			var logger = sut.getLogger(aName);

			assert.notInstanceOf(logger, DummyLogger);
		});

		test('getLogger should return DummyLog after clearAppenders is called', function () {
			var aName = 'mylogger';

			sut.clearAppenders();

			var logger = sut.getLogger(aName);

			assert.instanceOf(logger, DummyLogger);
		});

		test('getLogger should NOT return DummyLog after enableAppenders is called', function () {
			var aName = 'mylogger';

			sut.clearAppenders();

			var logger = sut.getLogger(aName);

			assert.instanceOf(logger, DummyLogger);

			sut.enableAppenders();

			logger = sut.getLogger(aName);

			assert.notInstanceOf(logger, DummyLogger);
		});
	});

});
