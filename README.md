# log2out
log to stdout

## usage example
*log2out* API is very similar (in fact it is a subset of log4js API).

```javascript
var log2out = require('log2out');
var logger = log2out.getLogger('MyCoolLogger');
var name = 'Peter';
logger.info('hello there "%s"', name, 3, 'String interpolation works fine.');
```

## log levels
log levels can be set using LOG4JS configuration file by setting environment variable:

```bash
export LOG4JS_CONFIG=/path/to/log4js.config.json
execute-my-cool-node.js
```

file example:
```javascript
{
    "levels": {
        "aLoggerName": "INFO",
        "[all]": "WARN"
    }
}
```