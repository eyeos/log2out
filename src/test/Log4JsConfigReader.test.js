'use strict';

var sinon = require('sinon');
var assert = require('chai').assert;
var Log4JsConfigReader = require('../lib/tools/Log4JsConfigReader');

suite('Log4JsConfigReader', function () {
	var fs;
	var sut;
	var mkdirpSync;
	var loggerName;
	var watchCallback;

	setup(function () {
		fs = {
			readFileSync: function () {
			},
			watch: function () {
			}
		};
		sinon.stub(fs, 'readFileSync');
		sinon.stub(fs, 'watch', function (filename, options, cb) {
			watchCallback = cb;
		});
		mkdirpSync = sinon.stub();
		loggerName = 'fake loggername';
	});

	suite('#getConfig without envars', function () {
		var expected_default_config;

		setup(function () {
			expected_default_config = {
				'levels': {
					'[all]': 'DEBUG'
				}
			};
			sut = new Log4JsConfigReader(loggerName, undefined, fs, mkdirpSync);
		});

		test('when called returns default config', function () {
			assert.deepEqual(sut.getConfig(), expected_default_config);
		});
	});

	suite('#getConfig with envars', function () {
		var env;
		var expected_default_config;

		setup(function () {
			env = {
				EYEOS_LOG_LEVEL: 'ENV_LOG_LEVEL',
				LOG4JS_CONFIG: '/fake/path/to/fake.log4js.config.json'
			};
			expected_default_config = {
				'levels': {
					'[all]': env['EYEOS_LOG_LEVEL']
				}
			};

			sut = new Log4JsConfigReader(loggerName, env, fs, mkdirpSync);
		});

		test('when called and log4js config file does not exist returns default config with EYEOS_LOG_LEVEL', function () {
			fs.readFileSync.throws(new Error("A fake error caused by readFileSync"));
			assert.deepEqual(sut.getConfig(), expected_default_config);
		});

		test('when called and log4js config file exists returns that config', function () {
			var returnedConfig = {
				'fake': 'configuration'
			};
			fs.readFileSync.returns(JSON.stringify(returnedConfig));
			assert.deepEqual(sut.getConfig(), returnedConfig)
		});
	});

	suite('#getConfiguredLevel', function () {
		var getConfigStub;
		var log4jsConfig;

		setup(function () {
			log4jsConfig = {
				"levels": {
					"test": "INFO",
					"[all]": "WARN"
				}
			};
		});
		function getSut(name) {
			sut = new Log4JsConfigReader(name, undefined, undefined, mkdirpSync);
			getConfigStub = sinon.stub(sut, 'getConfig');
			getConfigStub.returns(log4jsConfig);
			return sut;
		}

		test('level can be set with log4js-like configuration, default level is set in "[all]"', function () {
			sut = getSut(loggerName);
			assert.equal(sut.getConfiguredLevel(), 'WARN');
		});

		test('level can be set with log4js-like configuration', function () {
			sut = getSut('test');
			assert.equal(sut.getConfiguredLevel(), 'INFO');
		});
	});

	suite('#watch LOG4JS config file for changes', function () {
		var env;
		var config_file;

		setup(function () {
			config_file = '/fake/path/to/fake.log4js.config.json';
		});
		function getSut(log4js_config_file) {
			env = {
				LOG4JS_CONFIG: log4js_config_file
			};
			return new Log4JsConfigReader(loggerName, env, fs, mkdirpSync);
		}

		test('When env contains LOG4JS_CONFIG creates parent folder', function () {
			sut = getSut(config_file);
			sinon.assert.calledWithMatch(mkdirpSync, '/fake/path/to');
		});

		test('When env contains LOG4JS_CONFIG watches parent folder', function () {
			sut = getSut(config_file);
			sinon.assert.calledWithMatch(fs.watch, '/fake/path/to', { persistent: false}, sinon.match.func);
		});

		test('When env does not contain LOG4JS_CONFIG does not call fs.watch', function () {
			sut = getSut();
			sinon.assert.notCalled(fs.watch);
		});

		test('When env does not contain LOG4JS_CONFIG does not create parent folder', function () {
			sut = getSut();
			sinon.assert.notCalled(mkdirpSync);
		});

		test('When LOG4JS_CONFIG file changes calls self.configFileChangeHandler', function () {
			sut = getSut(config_file);
			var configFileChangeHandlerStub = sinon.stub(sut, 'configFileChangeHandler');
			watchCallback('fake event', 'fake.log4js.config.json');
			sinon.assert.calledWithExactly(configFileChangeHandlerStub);
			sinon.assert.calledOn(configFileChangeHandlerStub, sut);
		});

		test('When a file different than the LOG4JS_CONFIG file changes does not call self.configFileChangeHandler', function () {
			sut = getSut(config_file);
			var configFileChangeHandlerStub = sinon.stub(sut, 'configFileChangeHandler');
			watchCallback('fake event', 'some other file');
			sinon.assert.notCalled(configFileChangeHandlerStub);
		});
	});
});
