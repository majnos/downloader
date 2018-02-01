let winston = require('winston');
let toYAML = require('winston-console-formatter');


winston.setLevels({
    debug:0,
    info: 1,
    silly:2,
    warn: 3,
    error:4,
});
winston.addColors({
    debug: 'green',
    info:  'cyan',
    silly: 'magenta',
    warn:  'yellow',
    error: 'red'
});

let logger = new (winston.Logger)({
    levels: { 
        'error': 0, 
        'warn': 1, 
        'info': 2, 
        'verbose': 3, 
        'debug': 4, 
        'silly': 5 
      },    
    colors: {
        debug: 'green',
        info:  'cyan',
        silly: 'magenta',
        warn:  'yellow',
        error: 'red'
    },
    transports: [
      new (winston.transports.Console)({
          'timestamp': true,
          'colorize': true,
          'level': 'info'
        }),
      new (winston.transports.File)({ 
          filename: 'downloader.log',
          json: false

        })
    ]
  })

module.exports = logger;