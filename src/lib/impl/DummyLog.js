'use strict';

var format = require('util').format;

function doNothing(){
}

var DummyLog = function DummyLog(name) {
    if (!(this instanceof DummyLog)) {
        return new DummyLog(name);
    }
    this.name = name;
};

// copy ConsoleLog public interface, but doing nothing
var ConsoleLog = require('./ConsoleLog');
var conlogInstance = new ConsoleLog('dummy', {levels: {TRACE: '',INFO: '',DEBUG: '',WARN: '',ERROR: '',FATAL: ''},separator: ''});
for (var fnName in conlogInstance){
    DummyLog.prototype[fnName] = doNothing;
};

module.exports = DummyLog;
