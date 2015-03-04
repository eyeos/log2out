# logout
log to stdout

# log levels
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