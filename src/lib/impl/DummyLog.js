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

DummyLog.prototype.trace = doNothing;
DummyLog.prototype.debug = doNothing;
DummyLog.prototype.info = doNothing;
DummyLog.prototype.warn = doNothing;
DummyLog.prototype.error = doNothing;
DummyLog.prototype.fatal = doNothing;

module.exports = DummyLog;
