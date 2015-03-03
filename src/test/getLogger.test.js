'use strict';

var sinon = require('sinon');
var assert = require('chai').assert;


suite('log2out.getLogger.', function(){
    var sut;

    setup(function(){
        var log2out = require('../lib/index');
        sut = log2out.getLogger;
    });

    suite('#getLogger returns a logger.', function(){
        test('logger object has a debug method', function(){
            var logger = sut();

            assert.property(logger, 'debug');
            assert.isFunction(logger.debug);
        });

        test('logger object has an info method', function(){
            var logger = sut();

            assert.property(logger, 'info');
            assert.isFunction(logger.info);
        });

        test('logger object has a warn method', function(){
            var logger = sut();

            assert.property(logger, 'warn');
            assert.isFunction(logger.warn);
        });

        test('logger object has an error method', function(){
            var logger = sut();

            assert.property(logger, 'error');
            assert.isFunction(logger.error);
        });

        test('logger has a name', function(){
            var aName = 'mylogger';

            var logger = sut(aName);

            assert.equal(logger.name, aName);
        });

        test('logger object is unique for each call', function(){
            var aName = 'mylogger';

            var firstLogger = sut(aName);
            var secondLogger = sut(aName);

            assert.notEqual(firstLogger, secondLogger);
        });

    });
});

