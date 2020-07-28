import { Router } from 'express';
import * as cors from 'cors';
import * as parser from 'body-parser';
import * as compression from 'compression';
import * as helmet from 'helmet';

export const handleCors = (router: Router) => {
	//router.use(cors({ credentials: true, origin: true }));
	router.use(cors());
};

export const handleBodyRequestParsing = (router: Router) => {
	// parse application/x-www-form-urlencoded
	router.use(parser.urlencoded({ extended: true }));
	// parse application/json
	router.use(parser.json());
};

export const handleCompression = (router: Router) => {
	router.use(compression());
};

export const handleHelmet = (router: Router) => {
	// tslint:disable-next-line: no-console
	router.use(helmet());
};

export default [handleCors, handleBodyRequestParsing, handleCompression, handleHelmet];
