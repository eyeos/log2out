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
    });
});

