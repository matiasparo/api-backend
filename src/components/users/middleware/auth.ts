import { Response, NextFunction, Request } from 'express';
import { verify } from 'jsonwebtoken';
import { HTTP404Error, HTTP401Error } from '../../../utils/models/httpClientErrors';
import { UserService } from './../service/usersService';
import { IUser, IGetUserAuthInfoRequest } from './../models';
import { BannedIpService } from '../service/bannedIpService';
import { UserMessage } from '../userMessage';
const usrSvc = UserService.create();

const ensureAuthenticated = (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
	if (!req.headers.authorization) {
		return next(new HTTP404Error('no_autorization'));
	}

	const token = req.headers.authorization.split(' ')[1];
	verify(token, process.env.JWT_SECRET!, { algorithms: [process.env.JWT_ALGORITHM!] }, (err, payload: any) => {
		if (err) {
			// token expired
			return next(new HTTP401Error(err.message));
		} else {
			const idUser = parseInt(payload!.payload!.sub, 10);
			usrSvc
				.getUser(idUser)
				.then((user: IUser | null) => {
					if (user !== null) {
						req.user = user;
						next();
					}
				})
				.catch((error) => {
					if (error instanceof Error) {
						return next(error);
					} else {
						return next(new HTTP404Error(error.message));
					}
				});
		}
	});
};

const bannedUserIp = async (req: Request, res: Response, next: NextFunction) => {
	const { username } = req.body;
	const userIpBanned = await BannedIpService.getUserBannedIp(req.ip, username);

	if (userIpBanned) {
		delete userIpBanned.intents;
		delete userIpBanned.ip;
		delete userIpBanned.user;
		return res.status(401).json({
			ok: false,
			message: UserMessage.userBlocked,
			data: userIpBanned,
		});
	} else {
		return next();
	}
};
export { ensureAuthenticated, bannedUserIp };
