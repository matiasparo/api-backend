import { Request, Response, Router, NextFunction } from 'express';
import { UserMaker, IUserData, IGetUserAuthInfoRequest } from '../models';
import { UserService } from '../service/usersService';
import { ensureAuthenticated, bannedUserIp } from '../middleware/auth';
import { HTTP400Error } from '../../../utils/models';
import { UserMessage } from '../userMessage';
import { UserLogger } from '../usersLogger';
import { validRegisterUser, validAuthParameter } from './validateParamsApi';

const userApi = Router();
const uServ = UserService.create();

userApi.get('/', ensureAuthenticated, async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
	try {
		const users = await uServ.getUsers();
		if (users.length > 0) {
			res.json({
				ok: true,
				data: users,
			});
		} else {
			throw new HTTP400Error('No users found');
		}
	} catch (e) {
		next(e);
	}
});

userApi.post('/', validRegisterUser, async (req: Request, res: Response, next: NextFunction) => {
	const { email, name, password, roleId } = req.body;
	const user = UserMaker.create({ userName: email, firstName: name, lastName: name, password, roleId });
	try {
		const usr = await uServ.createUser(user);
		res.json({
			ok: true,
			data: usr,
		});
	} catch (error) {
		if (error instanceof Error) {
			next(error);
		} else {
			res.json({
				ok: false,
				message: error.message,
			});
		}
	}
});

userApi.put('/', (req: Request, res: Response) => {
	const { userName, firstName, lastName, password, roleId } = req.body;
	const user = UserMaker.create({ userName, firstName, lastName, password, roleId });
	try {
		uServ
			.updateUser(user)
			.then((usr) => {
				res.json({
					ok: usr,
				});
			})
			.catch((err) => {
				UserLogger.debug('api');
				UserLogger.debug(err);
				return res.status(501).json({
					ok: false,
					message: err.message,
				});
			});
	} catch (error) {
		UserLogger.debug('Api catch');
		UserLogger.debug(error);
	}
});

userApi.post('/auth', [validAuthParameter, bannedUserIp], (req: Request, res: Response, next: NextFunction) => {
	const { username, password } = req.body;
	uServ
		.authUser({ userName: username, password }, req.ip)
		.then((resp: IUserData) => {
			res.json(resp);
		})
		.catch((err) => {
			if (err instanceof Error) {
				next(err);
			} else {
				res.status(401).json({ ok: false, message: err.message, data: err?.data });
			}
		});
});

// TODO: LOGOUT
userApi.delete('/auth', (req: Request, res: Response, next: NextFunction) => {
	res.json({
		ok: true,
		message: 'ok',
	});
});

userApi.post('/confirm-register', async (req: Request, res: Response, next: NextFunction) => {
	const { token } = req.body;
	let isConfirm = false;
	if (token !== '') {
		//UserLogger.debug(token);
		const partialResult = await uServ.confirmRegister(token);
		isConfirm = partialResult || false;
	}
	res.json({ ok: isConfirm, message: '' });
});

userApi.put('/reset-password', async (req: Request, res: Response, next: NextFunction) => {
	const { token, password } = req.body;
	try {
		const responseDal = await uServ.resetPasswordFromToken(token, password);

		if (responseDal) {
			res.json({
				ok: true,
				message: '',
			});
		} else {
			res.status(412).json({
				ok: false,
				message: UserMessage.tokenError,
			});
		}
	} catch (error) {
		if (error instanceof Error) {
			next(error);
		} else {
			// ERROR PERSOLNALIZADO DE ESTA FUNCION
			res.status(412).json({
				ok: false,
				message: UserMessage.errorChange,
			});
		}
	}
});

userApi.post('/request-password', async (req: Request, res: Response, next: NextFunction) => {
	const { email } = req.body;
	try {
		const resp = await uServ.resetPassword(email);
		if (resp) {
			res.json({
				ok: true,
				messaje: '',
			});
		} else {
			res.json({
				ok: false,
				message: UserMessage.errorReset,
			});
		}
	} catch (error) {
		if (error instanceof Error) {
			next(error);
		} else {
			// ERROR PERSOLNALIZADO DE ESTA FUNCION
		}
	}
});

export { userApi };
