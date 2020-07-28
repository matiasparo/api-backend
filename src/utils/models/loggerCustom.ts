/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from '../';

export class LoggerCustom {
	static label = '[LOGGER_CUSTOM]';

	static error(message: string, err?: Error) {
		if (logger) {
			logger.error(`${this.label} - ${message} - ${err?.stack}`);
		}
	}

	static warning(msg: string, metaData?: any) {
		const meta = { meta: metaData };
		if (logger) {
			logger.warn(`${this.label} - ${msg}`, meta);
		}
	}

	static debug(msg: string, metaData?: any) {
		const meta = { meta: metaData };
		if (logger) {
			logger.debug(`${this.label} - ${msg}`, meta);
		}
	}

	static info(msg: string, metaData?: any) {
		const meta = { meta: metaData };
		if (logger) {
			logger.info(`${this.label} - ${msg}`, meta);
		}
	}
}
