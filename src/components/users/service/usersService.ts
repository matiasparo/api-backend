import { hashSync, compareSync } from 'bcrypt';
import { UserDal } from '../dal/usersDal';
import { ITokens, IUser, IUserData, TypeToken, Role } from '../models';
import { sign, Secret } from 'jsonwebtoken';
import { UserLogger } from '../usersLogger';
import { utc } from 'moment';
import { UserMessage } from '../userMessage';
import { BannedIpDal } from '../dal/bannedIpDal';
import { EmailService } from '@components/communication/index';

/**
 * LOGIC BUSINESS USER
 */
export class UserService {
	// tslint:disable-next-line: no-empty
	constructor() {}

	static create() {
		return new UserService();
	}

	async getUsers(): Promise<IUser[]> {
		return UserDal.getUsers();
	}

	async getUser(userId: number): Promise<IUser | null> {
		let resp: IUser | null = null;
		return new Promise<IUser | null>(async (resolve, reject) => {
			try {
				const userAuth = await UserDal.getUserFromId(userId);
				if (userAuth && userAuth.password) {
					delete userAuth.password;
				}
				resp = userAuth;
				resolve(resp);
			} catch (err) {
				if (err === null) {
					// eslint-disable-next-line no-ex-assign
					err = { ok: false, message: UserMessage.notExistUserId };
				} else {
					err.message = `token: ${err?.message}`;
				}
				UserLogger.error(err);
				reject(err);
			}
		});
	}

	async createUser(user: IUser) {
		return new Promise<IUser>(async (resolve, rejects) => {
			// valid user exist
			const usrDB = await this.checkUserName(user.userName);
			if (usrDB) {
				rejects({
					ok: false,
					message: 'user_already_exists',
				});
			} else {
				if (user.password) {
					const salt = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);
					user!.password = hashSync(user.password, salt);
				}

				const userNew = await UserDal.createUser(user);
				if (userNew.id && userNew.userName) {
					// create configuration Item Menu to user
					await UserDal.createItemsUser(Role.OWNER, userNew.id);
					// enerate token to confirm the account
					const time = new Date().getTime();
					const tokenGenerate = this.generateToken(time);

					const tokenLogin: ITokens = {
						idUser: userNew.id || 0,
						token: tokenGenerate,
						type: TypeToken.Create,
						expirationDate: utc().add(process.env.TOKEN_CREATE_ACCOUNT_EXPIRATION_HOURS, 'hours').toDate(),
					};
					const resultAccountToken: boolean = await UserDal.generateTokenRegister(tokenLogin);
					if (resultAccountToken) {
						if (userNew?.email) {
							EmailService.sendEmailRegister(userNew, tokenGenerate);
						}
					} else {
						UserLogger.error('ERROR WHEN GENERATING TOKEN');
					}
				}
				resolve(userNew);
			}
		});
	}

	async updateUser(user: IUser) {
		return UserDal.updateUser(user)
			.then((res: boolean) => {
				return res;
			})
			.catch((err) => {
				return false;
			});
	}

	async authUser(user: IUser, ip = '127.0.0.1'): Promise<IUserData> {
		// auth
		const resp: IUserData = { user: null, token: null };
		return new Promise<IUserData>(async (resolve, reject) => {
			try {
				const userAuth = await UserDal.getUserFromName(user.userName);

				//UserLogger.debug('userAuth', userAuth!);
				if (userAuth && !userAuth.isConfirm) {
					reject({ ok: false, message: 'error_no_active' });
				}

				if (userAuth === null || !compareSync(user.password, userAuth!.password || '')) {
					//UserLogger.debug(`no login failed password for user ${user.userName}`);
					if (userAuth) {
						const cntIntent = await UserDal.incrementIntentAuth(userAuth);
						if (cntIntent >= (process.env.MAX_INTENTS_LOGIN || 3)) {
							//UserLogger.debug(`User ${user.userName} Blocked intents: ${cntIntent}`);
							//UserLogger.warning(`User ${user.userName} Blocked intents: ${cntIntent}`);
							let bannedIp = null;
							if (userAuth.id) {
								bannedIp = await BannedIpDal.bannedIpUser(ip, cntIntent, userAuth.userName);
								if (bannedIp != null) {
									delete bannedIp.intents;
									delete bannedIp.ip;
									delete bannedIp.user;
								}
								// After banning the ip, I reset the attempt counter
								UserDal.resetIntentAuth(userAuth);
							}
							reject({ ok: false, message: UserMessage.userBlocked, data: bannedIp });
						}
					}
					reject({ ok: false, message: UserMessage.errorAuth });
				} else {
					delete userAuth.password;
					UserDal.resetIntentAuth(userAuth);
					const payload = {
						sub: userAuth.id,
						exp: Date.now() + parseInt(process.env.JWT_LIFETIME || '', 10),
						username: userAuth.userName,
						firstName: userAuth.firstName,
						lastName: userAuth.lastName,
						roleId: userAuth.roleId,
					};

					const token = this.generateToken(payload);
					//UserLogger.debug(`correct login token ${token}`, payload);
					resp.user = userAuth;
					resp.token = token;
					//UserLogger.debug(`data: ${JSON.stringify(resp.user)}`);
					resolve(resp);
				}
			} catch (err) {
				err.message = `token: ${err.message}`;
				UserLogger.error('error auth User', err);
				// pasar objeto error server?
				reject(err);
			}
		});
	}

	async confirmRegister(token: string) {
		try {
			const userToken = await UserDal.getTokenRegister(token);
			//UserLogger.debug('userToken', userToken!);
			if (userToken && userToken.id) {
				// enabled account
				const enableAccount = await UserDal.confirmAccount(userToken);
				// disabled token
				if (enableAccount) {
					const updateToken: ITokens = { token, idUser: userToken.id, usedDate: utc().toDate(), isUsed: true, type: TypeToken.Create };
					const changeTokenResult = await UserDal.changeToken(updateToken);
					return changeTokenResult;
				}
				return false;
			}
		} catch (e) {
			throw new Error(e);
		}
	}

	async resetPassword(email: string) {
		// SEARCH USER
		const user = await UserDal.getUserFromName(email);

		if (user) {
			// GENERATE TOKEN
			const time = new Date().getTime();
			const tokenGenerate = this.generateToken(time);

			const tokenLogin: ITokens = {
				idUser: user.id || 0,
				token: tokenGenerate,
				type: TypeToken.Login,
				expirationDate: utc().add(process.env.TOKEN_RESET_PASSWORD_EXPIRATION_HOURS, 'hours').toDate(),
			};

			const isGenerated = await UserDal.generateTokenLogin(tokenLogin);
			//UserLogger.debug('isGenerated ' + isGenerated);
			if (isGenerated) {
				if (user?.email) {
					UserLogger.debug(`Mando el correo con token: ${tokenGenerate}`);
					EmailService.sendEmailResetPassword(user, tokenGenerate);
				}
				return true;
			} else {
				UserLogger.error('ERROR WHEN GENERATING TOKEN to reset password');
			}
		}
		return false;
	}

	async resetPasswordFromToken(token: string, password: string) {
		const userToken = await UserDal.getTokenLogin(token);
		if (userToken) {
			const salt = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);
			const passwordHash = hashSync(password, salt);
			const userId = userToken.id ? userToken.id : 0;
			const resultChange = await UserDal.changePassword(userId, passwordHash);
			if (resultChange) {
				const updateTokenLogin: ITokens = { token, idUser: userId, usedDate: utc().toDate(), isUsed: true, type: TypeToken.Login };
				const changeTokenResult = await UserDal.changeToken(updateTokenLogin);
				if (changeTokenResult) {
					return true;
				}

				return false;
			}
		}
		return false;
	}

	private async checkUserName(userName: string) {
		const usrDB = await UserDal.getUserFromName(userName);
		return usrDB != null;
	}

	private generateToken(payload: any) {
		const SEED: Secret = process.env.JWT_SECRET || 'DEV';
		return sign({ payload }, SEED, { expiresIn: process.env.JWT_EXPIRE_TOKEN, algorithm: process.env.JWT_ALGORITHM });
	}
}
