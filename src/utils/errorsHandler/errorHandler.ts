import { Response, NextFunction, Request } from 'express';
import { HTTPClientError, HTTP404Error } from '../models';
import { LoggerCustom } from '../models/loggerCustom';

export const notFoundError = () => {
	throw new HTTP404Error('Method not found.');
};

export const clientError = (err: Error, req: Request, res: Response, next: NextFunction) => {
	if (err instanceof HTTPClientError) {
		LoggerCustom.error('httpclienterror linea', err);
		res.status(err.statusCode).send(err.message);
	} else {
		next(err);
	}
};

export const serverError = (err: Error, req: Request, res: Response, next: NextFunction) => {
	if (!err) {
		return next();
	}

	LoggerCustom.error('serverError', err);
	if (process.env.NODE_ENV === 'production') {
		res.status(500).send('Internal Server Error');
	} else {
		res.status(500).send(err.stack);
	}
};
