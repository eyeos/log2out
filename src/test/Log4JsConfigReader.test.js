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

	suite('#getDefaultConfig without envars', function () {
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
			assert.deepEqual(sut.getDefaultConfig(), expected_default_config);
		});
	});

	suite('#getDefaultConfig with envars', function () {
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
			assert.deepEqual(sut.getDefaultConfig(), expected_default_config);
		});

		test('when called and log4js config file exists returns that config', function () {
			var returnedConfig = {
				'fake': 'configuration'
			};
			fs.readFileSync.returns(JSON.stringify(returnedConfig));
			assert.deepEqual(sut.getDefaultConfig(), returnedConfig)
		});
	});
});
