'use strict';

var sinon = require('sinon');
var assert = require('chai').assert;

var ConsoleLog = require('../lib/impl/ConsoleLog');
var log2out = require('../lib/index');

var FormaterFactory = require('../lib/formaters/FormaterFactory');

suite('ConsoleLog', function () {
	var sut;

	setup(function () {
		var log2out = require('../lib/index');
		sut = new ConsoleLog('test', log2out.settings);
	});

	suite('#name', function () {
		test('logger name should be established on constructor', function () {
			assert(sut.loggerName === 'test')
		});

		test('logger default name is ""', function () {
			sut = new ConsoleLog(undefined, log2out.settings);
			assert(sut.loggerName === '')
		});
	});

	suite('#level', function () {
		var log4jsConfig;

		setup(function () {
			log4jsConfig = {
				"levels": {
					"test": "INFO",
					"[all]": "WARN"
				}
			}
		});

		test('default level is "DEBUG"', function () {
			sut = new ConsoleLog('test', log2out.settings);

			assert.equal(sut.getLevelName(), 'DEBUG')
		});

		test('level can be set with log4js-like configuration', function () {
			sut = new ConsoleLog('test', log2out.settings, log4jsConfig);

			assert.equal(sut.getLevelName(), 'INFO')
		});

		test('level can be set with log4js-like configuration, default level is set in "[all]"', function () {
			sut = new ConsoleLog('another-one', log2out.settings, log4jsConfig);

			assert.equal(sut.getLevelName(), 'WARN');
		});
	});

	suite('#log to adequate level', function () {
		var systemConsoleLogSpy;
		var log4jsConfig = {
			"levels": {
				"fromTrace": "TRACE",
				"fromDebug": "DEBUG",
				"fromInfo": "INFO",
				"fromWarn": "WARN",
				"fromError": "ERROR",
				"fromFatal": "FATAL",
				"fromOff": "OFF"

			}
		};

		setup(function () {
			systemConsoleLogSpy = sinon.spy(console, 'log');
		});

		teardown(function () {
			systemConsoleLogSpy.restore();
		});

		test('when level is "TRACE", only adequate calls use console.log', function () {
			sut = new ConsoleLog('fromTrace', log2out.settings, log4jsConfig);
			assert.equal(sut.getLevelName(), 'TRACE');


			sut.trace('something');
			assert.equal(systemConsoleLogSpy.callCount, 1);

			sut.debug('something');
			assert.equal(systemConsoleLogSpy.callCount, 2);

			sut.info('something');
			assert.equal(systemConsoleLogSpy.callCount, 3);

			sut.warn('something');
			assert.equal(systemConsoleLogSpy.callCount, 4);

			sut.error('something');
			assert.equal(systemConsoleLogSpy.callCount, 5);

			sut.fatal('something');
			assert.equal(systemConsoleLogSpy.callCount, 6);
		});


		test('when level is "DEBUG", only adequate calls use console.log', function () {
			sut = new ConsoleLog('fromDebug', log2out.settings, log4jsConfig);
			assert.equal(sut.getLevelName(), 'DEBUG');


			sut.trace('something');
			assert.equal(systemConsoleLogSpy.callCount, 0);

			sut.debug('something');
			assert.equal(systemConsoleLogSpy.callCount, 1);

			sut.info('something');
			assert.equal(systemConsoleLogSpy.callCount, 2);

			sut.warn('something');
			assert.equal(systemConsoleLogSpy.callCount, 3);

			sut.error('something');
			assert.equal(systemConsoleLogSpy.callCount, 4);

			sut.fatal('something');
			assert.equal(systemConsoleLogSpy.callCount, 5);
		});

		test('when level is "INFO", only adequate calls use console.log', function () {
			sut = new ConsoleLog('fromInfo', log2out.settings, log4jsConfig);

			assert.equal(sut.getLevelName(), 'INFO');


			sut.trace('something');
			assert.equal(systemConsoleLogSpy.callCount, 0);

			sut.debug('something');
			assert.equal(systemConsoleLogSpy.callCount, 0);

			sut.info('something');
			assert.equal(systemConsoleLogSpy.callCount, 1);

			sut.warn('something');
			assert.equal(systemConsoleLogSpy.callCount, 2);

			sut.error('something');
			assert.equal(systemConsoleLogSpy.callCount, 3);

			sut.fatal('something');
			assert.equal(systemConsoleLogSpy.callCount, 4);
		});

		test('when level is "WARN", only adequate calls use console.log', function () {
			sut = new ConsoleLog('fromWarn', log2out.settings, log4jsConfig);

			assert.equal(sut.getLevelName(), 'WARN');


			sut.trace('something');
			assert.equal(systemConsoleLogSpy.callCount, 0);

			sut.debug('something');
			assert.equal(systemConsoleLogSpy.callCount, 0);

			sut.info('something');
			assert.equal(systemConsoleLogSpy.callCount, 0);

			sut.warn('something');
			assert.equal(systemConsoleLogSpy.callCount, 1);

			sut.error('something');
			assert.equal(systemConsoleLogSpy.callCount, 2);

			sut.fatal('something');
			assert.equal(systemConsoleLogSpy.callCount, 3);
		});

		test('when level is "ERR", only adequate calls use console.log', function () {
			sut = new ConsoleLog('fromError', log2out.settings, log4jsConfig);

			assert.equal(sut.getLevelName(), 'ERROR');


			sut.trace('something');
			assert.equal(systemConsoleLogSpy.callCount, 0);

			sut.debug('something');
			assert.equal(systemConsoleLogSpy.callCount, 0);

			sut.info('something');
			assert.equal(systemConsoleLogSpy.callCount, 0);

			sut.warn('something');
			assert.equal(systemConsoleLogSpy.callCount, 0);

			sut.error('something');
			assert.equal(systemConsoleLogSpy.callCount, 1);

			sut.fatal('something');
			assert.equal(systemConsoleLogSpy.callCount, 2);
		});

		test('when level is "FATAL", only adequate calls use console.log', function () {
			sut = new ConsoleLog('fromFatal', log2out.settings, log4jsConfig);

			assert.equal(sut.getLevelName(), 'FATAL');


			sut.trace('something');
			assert.equal(systemConsoleLogSpy.callCount, 0);

			sut.debug('something');
			assert.equal(systemConsoleLogSpy.callCount, 0);

			sut.info('something');
			assert.equal(systemConsoleLogSpy.callCount, 0);

			sut.warn('something');
			assert.equal(systemConsoleLogSpy.callCount, 0);

			sut.error('something');
			assert.equal(systemConsoleLogSpy.callCount, 0);

			sut.fatal('something');
			assert.equal(systemConsoleLogSpy.callCount, 1);
		});

		test('when level is "OFF", no one calls use console.log', function () {
			sut = new ConsoleLog('fromOff', log2out.settings, log4jsConfig);

			assert.equal(sut.getLevelName(), 'OFF');


			sut.trace('something');
			assert.equal(systemConsoleLogSpy.callCount, 0);

			sut.debug('something');
			assert.equal(systemConsoleLogSpy.callCount, 0);

			sut.info('something');
			assert.equal(systemConsoleLogSpy.callCount, 0);

			sut.warn('something');
			assert.equal(systemConsoleLogSpy.callCount, 0);

			sut.error('something');
			assert.equal(systemConsoleLogSpy.callCount, 0);

			sut.fatal('something');
			assert.equal(systemConsoleLogSpy.callCount, 0);
		});

		suite('#configureLogger', function () {
			setup(function () {
				sut = new ConsoleLog('fromWarn', log2out.settings, log4jsConfig);
			});

			test('when configuring with lower priority it logs adequately', function () {
				// GUARDS
				// assert logging warn but not info
				sut.info('some info');
				assert.equal(systemConsoleLogSpy.callCount, 0);
				sut.warn('some warn');
				assert.equal(systemConsoleLogSpy.callCount, 1);

				// test begins here
				log4jsConfig['levels']['fromWarn'] = 'INFO';
				sut.configureLogger(log4jsConfig);

				// now should log from info, warn, ..., but not debug or lower
				sut.info('some info after setting INFO');
				assert.equal(systemConsoleLogSpy.callCount, 2);
				sut.warn('some warn after setting INFO');
				assert.equal(systemConsoleLogSpy.callCount, 3);
				sut.debug('some debug after setting INFO');
				assert.equal(systemConsoleLogSpy.callCount, 3);
			});

			test('when configuring with higher priority it logs adequately', function () {
				// GUARDS
				// assert logging warn and error
				sut.warn('some warn');
				assert.equal(systemConsoleLogSpy.callCount, 1);
				sut.error('some error');
				assert.equal(systemConsoleLogSpy.callCount, 2);

				// test begins here
				log4jsConfig['levels']['fromWarn'] = 'ERROR';
				sut.configureLogger(log4jsConfig);

				// now should not log warn but should continue logging error
				sut.warn('some warn after setting ERROR');
				assert.equal(systemConsoleLogSpy.callCount, 2);
				sut.error('some error after setting ERROR');
				assert.equal(systemConsoleLogSpy.callCount, 3);
			});
		});
	});

	suite('#formaters', function () {
		var sut;
		var log4jsConfig, formatedText, dummyFormater;

		setup(function () {
			formatedText = 'Formated text';
			dummyFormater = {
				format: function () {
					return formatedText
				}
			};
			sinon.stub(FormaterFactory, 'getInstance').returns(dummyFormater);
			log4jsConfig = {
				"levels": {
					"[all]": "INFO"
				}
			}
			sut = new ConsoleLog('formaterTest', log2out.settings, log4jsConfig, FormaterFactory);
		});

		test('If a formater is set should log the text returned by the formater', function () {
			var systemConsoleLogSpy = sinon.spy(console, 'log');
			sut.setFormater('DummyFormater');
			sut.info('something');
			sinon.assert.calledWithExactly(systemConsoleLogSpy, formatedText);
		});

	});
});
