'use strict';

var sinon = require('sinon');
var assert = require('chai').assert;

var ConsoleLog = require('../lib/impl/ConsoleLog');
var log2out = require('../lib/index');

var path = require('path');
var fs = require('fs');

suite('ConsoleLog', function(){
    var sut;

    setup(function(){
        var log2out = require('../lib/index');
        sut = new ConsoleLog('test', log2out.settings);
    });

    suite('#name', function(){
        test('logger name should be established on constructor', function(){
            assert(sut.name === 'test')
        });

        test('logger default name is ""', function(){
            sut = new ConsoleLog(undefined, log2out.settings);
            assert(sut.name === '')
        });
    });

    suite('#level', function(){
        var log4jsConfig;

        setup(function(){
            log4jsConfig = {
                "levels": {
                    "test": "INFO",
                    "[all]": "WARN"
                }
            }
        });

        test('default level is "DEBUG"', function(){
            sut = new ConsoleLog('test', log2out.settings);

            assert.equal(sut.getLevelName(), 'DEBUG')
        });

        test('level can be set with log4js-like configuration', function(){
            sut = new ConsoleLog('test', log2out.settings, log4jsConfig);

            assert.equal(sut.getLevelName(), 'INFO')
        });

        test('level can be set with log4js-like configuration, default level is set in "[all]"', function(){
            sut = new ConsoleLog('another-one', log2out.settings, log4jsConfig);

            assert.equal(sut.getLevelName(), 'WARN');
        });
    });

    suite('#log to adequate level (TEST STUBBING CONSOLE.LOG - ERRORS MAY NOT BE SEEN)', function(){
        var systemConsoleLogSpy;
        var log4jsConfig = {
                "levels": {
                    "fromInfo": "INFO",
                    "fromWarn": "WARN",
                    "fromErr": "ERR",
                    "fromDebug": "DEBUG"
                }
            };

        test('when level is "INFO", only adequate calls use console.log', function(){
            systemConsoleLogSpy = sinon.stub(console, 'log');
            sut = new ConsoleLog('fromInfo', log2out.settings, log4jsConfig);

            assert.equal(sut.getLevelName(), 'INFO');

            sut.debug('something');
            assert.isFalse(systemConsoleLogSpy.called);

            sut.info('something');
            assert.isTrue(systemConsoleLogSpy.calledOnce);

            sut.warn('something');
            assert.isTrue(systemConsoleLogSpy.calledTwice);

            sut.error('something');
            assert.isTrue(systemConsoleLogSpy.calledThrice);

            systemConsoleLogSpy.restore();
        });

        test('when level is "WARN", only adequate calls use console.log', function(){
            systemConsoleLogSpy = sinon.stub(console, 'log');
            sut = new ConsoleLog('fromWarn', log2out.settings, log4jsConfig);

            assert.equal(sut.getLevelName(), 'WARN');

            sut.debug('something');
            assert.isFalse(systemConsoleLogSpy.called);

            sut.info('something');
            assert.isFalse(systemConsoleLogSpy.called);

            sut.warn('something');
            assert.isTrue(systemConsoleLogSpy.calledOnce);

            sut.error('something');
            assert.isTrue(systemConsoleLogSpy.calledTwice);

            systemConsoleLogSpy.restore();
        });

        test('when level is "ERR", only adequate calls use console.log', function(){
            systemConsoleLogSpy = sinon.stub(console, 'log');
            sut = new ConsoleLog('fromErr', log2out.settings, log4jsConfig);

            assert.equal(sut.getLevelName(), 'ERR');

            sut.debug('something');
            assert.isFalse(systemConsoleLogSpy.called);

            sut.info('something');
            assert.isFalse(systemConsoleLogSpy.called);

            sut.warn('something');
            assert.isFalse(systemConsoleLogSpy.called);

            sut.error('something');
            assert.isTrue(systemConsoleLogSpy.calledOnce);

            systemConsoleLogSpy.restore();
        });

        test('when level is "DEBUG", only adequate calls use console.log', function(){
            systemConsoleLogSpy = sinon.stub(console, 'log');
            sut = new ConsoleLog('fromDebug', log2out.settings, log4jsConfig);

            assert.equal(sut.getLevelName(), 'DEBUG');

            sut.debug('something');
            assert.isTrue(systemConsoleLogSpy.calledOnce);

            sut.info('something');
            assert.isTrue(systemConsoleLogSpy.calledTwice);

            sut.warn('something');
            assert.isTrue(systemConsoleLogSpy.calledThrice);

            sut.error('something');
            assert.isTrue(systemConsoleLogSpy.callCount === 4);

            systemConsoleLogSpy.restore();
        });
    });

});
