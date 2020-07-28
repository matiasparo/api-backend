import { createLogger, format, LoggerOptions, transports, LeveledLogMethod } from 'winston';
import './secrets';

const activeLogger: boolean = process.env.CUSTOM_LOGGER_ACTIVE == null ? false : process.env.CUSTOM_LOGGER_ACTIVE !== 'true';
const timeStamp = format.timestamp;
const printf = format.printf;

const customFormat = printf((info) => {
	let metaLog = '';
	if (typeof info.meta === 'object') {
		metaLog = JSON.stringify(info.meta);
	}
	return `${info.timestamp} - ${info.level}: ${info.message} - ${metaLog}`;
});

const options: LoggerOptions = {
	defaultMeta: { service: 'test' },
	format: format.combine(timeStamp(), customFormat),
	level: 'info',
	transports: [
		new transports.File({ filename: 'logs/error.log', level: 'error', silent: activeLogger }),
		new transports.File({ filename: 'logs/debug.log', level: 'debug', silent: activeLogger }),
	],
	exitOnError: false,
};

const logger = createLogger(options);

if (process.env.NODE_ENV !== 'production') {
	logger.add(
		new transports.Console({
			format: format.combine(format.timestamp(), format.colorize(), customFormat),
			level: 'debug',
			silent: activeLogger,
		}),
	);
	logger.debug('Logging initialized at debug level');
}

export { logger };
