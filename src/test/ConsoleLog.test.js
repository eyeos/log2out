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

});
