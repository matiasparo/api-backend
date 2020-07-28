import { Response, NextFunction, Request } from 'express';
import { UserMessage } from '../userMessage';

const validRegisterUser = (req: Request, res: Response, next: NextFunction) => {
	if (req.body.email && req.body.email !== '' && req.body.name && req.body.password && req.body.password !== '') {
		next();
	} else {
		return res.status(412).json({
			ok: false,
			message: UserMessage.errorParametersCreate,
		});
	}
};

const validAuthParameter = (req: Request, res: Response, next: NextFunction) => {
	if (req.body.username && req.body.username !== '' && req.body.password && req.body.password !== '') {
		next();
	} else {
		return res.status(412).json({
			ok: false,
			message: UserMessage.errorParametersAuth,
		});
	}
};

export { validRegisterUser, validAuthParameter };
