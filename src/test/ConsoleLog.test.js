'use strict';

var sinon = require('sinon');
var assert = require('chai').assert;

var ConsoleLog = require('../lib/impl/ConsoleLog');
var log2out = require('../lib/index');

var path = require('path');
var fs = require('fs');

var FormaterFactory = require('../lib/formaters/FormaterFactory');

suite('ConsoleLog', function () {
	var sut;

	setup(function () {
		var log2out = require('../lib/index');
		sut = new ConsoleLog('test', log2out.settings);
	});

	suite('#name', function () {
		test('logger name should be established on constructor', function () {
			assert(sut.name === 'test')
		});

		test('logger default name is ""', function () {
			sut = new ConsoleLog(undefined, log2out.settings);
			assert(sut.name === '')
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

		test('when level is "TRACE", only adequate calls use console.log', function () {
			systemConsoleLogSpy = sinon.spy(console, 'log');
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

			systemConsoleLogSpy.restore();
		});


		test('when level is "DEBUG", only adequate calls use console.log', function () {
			systemConsoleLogSpy = sinon.spy(console, 'log');
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

			systemConsoleLogSpy.restore();
		});

		test('when level is "INFO", only adequate calls use console.log', function () {
			systemConsoleLogSpy = sinon.spy(console, 'log');
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

			systemConsoleLogSpy.restore();
		});

		test('when level is "WARN", only adequate calls use console.log', function () {
			systemConsoleLogSpy = sinon.spy(console, 'log');
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

			systemConsoleLogSpy.restore();
		});

		test('when level is "ERR", only adequate calls use console.log', function () {
			systemConsoleLogSpy = sinon.spy(console, 'log');
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

			systemConsoleLogSpy.restore();
		});

		test('when level is "FATAL", only adequate calls use console.log', function () {
			systemConsoleLogSpy = sinon.spy(console, 'log');
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

			systemConsoleLogSpy.restore();
		});

		test('when level is "OFF", no one calls use console.log', function () {
			systemConsoleLogSpy = sinon.spy(console, 'log');
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

			systemConsoleLogSpy.restore();
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
