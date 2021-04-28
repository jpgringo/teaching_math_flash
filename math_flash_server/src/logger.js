const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const path = require('path');
const { combine, /*timestamp,*/ label, printf } = format;


Date.prototype.toLocalizedISOString = function () {
    const tzo = -this.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function (num) {
            const norm = Math.floor(Math.abs(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return this.getFullYear() +
        '-' + pad(this.getMonth() + 1) +
        '-' + pad(this.getDate()) +
        'T' + pad(this.getHours()) +
        ':' + pad(this.getMinutes()) +
        ':' + pad(this.getSeconds()) +
        dif + pad(tzo / 60) +
        ':' + pad(tzo % 60);
};

console.log(`process.env.NODE_ENV`, process.env.NODE_ENV);
const appName = process.env.NODE_ENV === 'test' ? 'automaton server' : process.env.PROCESS_NAME || require(path.join(path.dirname(require.main.filename), '../package.json')).name || require.main.filename;

const myFormat = printf(info => {
    return `${info.timestamp} [${info.label}] ${process.pid} ${info.level}: ${info.message}`;
});


const customizedTimeStamp = format((info, opts) => {
    if (opts.localTime) {
        info.timestamp = (new Date()).toLocalizedISOString();
    } else {
        info.timestamp = (new Date()).toISOString();
    }
    return info;
});

const forceToSingleLine = format(info => {
  info.message = info.message.replace(/\s*\n+\s*/g, ' ');
  return info;
})

const singleLineFormat = combine(
  format.splat(),
  label({label: appName}),
  customizedTimeStamp({localTime: true}),
  myFormat,
  forceToSingleLine()
);

const prettyPrintedFormat = combine(
  format.splat(),
  label({label: appName}),
  customizedTimeStamp({localTime: true}),
  myFormat
);

const fileDateStampPattern = 'YYYY-MM-DD'; // 'YYYY-MM-DDTHH' or 'YYYY-MM-DDTHH:mm' also feasible

const logger = createLogger({
  level: 'info',
  format: singleLineFormat,
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    new transports.DailyRotateFile({
      name: 'file',
      datePattern: fileDateStampPattern,
      filename: path.join(__dirname, '/../logs/', '%DATE%.combined.log'),
      maxFiles: '7d',
      format: singleLineFormat,
    }),
    new transports.DailyRotateFile({
      name: 'file',
      datePattern: fileDateStampPattern,
      filename: path.join(__dirname, '/../logs/', '%DATE%.error.log'),
      maxFiles: '7d',
      format: singleLineFormat,
      level: 'error'
    })
  ]
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
logger.info(`NODE_ENV=${process.env.NODE_ENV}`);
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
      format: singleLineFormat, // format.simple(),
        colorize: true
    }));
}

logger.createNamedLogger = function (fullPath = false) {
  // TODO: figure out why 'createNamedLogger' doesn't work the same as in other repos
  // const caller = new Error().stack.split('\n').slice(3, 4)[0];
  // const callerFilePathMatches = (/^\s*at\s+\w+(.*?)([^\/]+\.\w+)/).exec(caller);
  // const callerFilePath = (fullPath ? callerFilePathMatches[1] : '')
  //   + callerFilePathMatches[2];
  const callerFilePath = fullPath;
  return {
    info: function () {
      arguments[0] = `${arguments[0]}\t${callerFilePath}`;
      if(arguments.length > 1 && arguments[1].message) { // avoid 'message' key collision with logger
        const msg = arguments[1].message;
        const modifiedArg = Object.assign({msg: msg}, arguments[1]);
        delete modifiedArg.message;
        arguments[1] = modifiedArg;
      }
      logger.info(...arguments)
    },
    error: function () {
      arguments[0] = `${callerFilePath} - ${arguments[0]}`;
      logger.error(...arguments)
    }
  }
}


module.exports = logger;
module.exports.stream = {
    write: function(message/*, encoding*/){
        if(process.env.NODE_ENV === 'production') {
            logger.info(message.replace(/\s*\n+\s*/, ' '));
        } else {
            logger.info(message.replace(/\s*\n+\s*/, ' '));
        }
    }
};
