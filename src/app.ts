import 'module-alias/register';
import '@utils/secrets';
import router from './routes';
import Server from './server/server';
import middleware from './middleware';
import errorHanders from './middleware/errorHandlers';
import { createConnection } from 'typeorm';
import { logger, EvoTransport, applyMiddleware } from './utils';
import { SysLogService } from './components/logs';
import { LoggerCustom } from './utils/models/loggerCustom';

process.on('uncaughtException', (e) => {
	LoggerCustom.error('uncaughtException', e);
	process.exit(1);
});
process.on('unhandledRejection', (e) => {
	LoggerCustom.error('unhandledRejection', new Error('unhandledRejection'));
	process.exit(1);
});

// DATA BASE
createConnection()
	.then(async (connection) => {
		try {
			if (process.env.CUSTOM_LOGGER_DB_ACTIVE === 'true') {
				const sysLogSvc = SysLogService.create();
				logger.add(new EvoTransport({ component: sysLogSvc, level: 'error' }));
				logger.add(new EvoTransport({ component: sysLogSvc, level: 'warn' }));
			}
		} catch (err) {
			LoggerCustom.error('error in creating transport to database', err);
		}
		LoggerCustom.debug('database online', { init: true });
	})
	.catch((err) => {
		LoggerCustom.error('error connection!');
		LoggerCustom.error(err);
	});

const port = parseInt(process.env.PORT, 10);

const server = Server.init(port);

applyMiddleware(middleware, server.app);

// ROUTES
server.app.use(router);

// error handler
applyMiddleware(errorHanders, server.app);

server.start(() => {
	// tslint:disable-next-line: no-console
	LoggerCustom.debug('server init');
});
