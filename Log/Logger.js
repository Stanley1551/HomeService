const { createLogger, format, transports } = require('winston');
const logger = createLogger(
    {
        transports : [
            new transports.File({ filename: 'HomeService.log'}),
        ],
        defaultMeta : { service: 'HomeService' },
        format: format.combine(
            format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss'
            }),
            format.errors({ stack: true }),
            format.splat(),
            format.json()
          ),
        level : 'info',
    }
);

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }));
  }

module.exports = {
    logger: logger
}