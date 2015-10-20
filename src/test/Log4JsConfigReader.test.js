'use strict';

var sinon = require('sinon');
var assert = require('chai').assert;
var Log4JsConfigReader = require('../lib/tools/Log4JsConfigReader');

suite('Log4JsConfigReader', function () {
	var fs;
	var sut;
	var toRestore = [];

	setup(function () {
		fs = {
			readFileSync: function () {
			}
		};
		toRestore.push(sinon.stub(fs));
	});

	teardown(function () {
		//for (var i = 0; i < toRestore.length; i++) {
		//	console.log('calling to restore() on ', i, toRestore[i]);
		//	toRestore[i].restore();
		//}
	});

	suite('#getConfig without envars', function () {
		var expected_default_config;

		setup(function () {
			expected_default_config = {
				'levels': {
					'[all]': 'DEBUG'
				}
			};
			sut = new Log4JsConfigReader(undefined, fs);
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

			sut = new Log4JsConfigReader(env, fs);
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
		var sut;

		setup(function () {
			log4jsConfig = {
				"levels": {
					"test": "INFO",
					"[all]": "WARN"
				}
			}
			sut = new Log4JsConfigReader();
			getConfigStub = sinon.stub(sut, 'getConfig');
			getConfigStub.returns(log4jsConfig);
		});

		test('level can be set with log4js-like configuration, default level is set in "[all]"', function () {
			assert.equal(sut.getConfiguredLevel('whatever'), 'WARN');
		});

		test('level can be set with log4js-like configuration', function () {
			assert.equal(sut.getConfiguredLevel('test'), 'INFO');
		});
	});
});
