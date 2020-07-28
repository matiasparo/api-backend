import { UserData, User, Tokens } from './entities';
import { IUser, ITokens, TypeToken, Role } from '../models';
import { UserLogger } from '../usersLogger';
import { getRepository, Raw, IsNull } from 'typeorm';
import { utc } from 'moment';

/**
 * Stored Data User
 */
export class UserDal {
	static get instance() {
		return this._instance || (this._instance = new UserDal());
	}

	// tslint:disable-next-line: variable-name
	private static _instance: UserDal;

	// tslint:disable-next-line: no-empty
	constructor() {}

	static async getUsers() {
		return new Promise<IUser[]>(async (resolve, rejects) => {
			try {
				const userRepository = getRepository(UserData);
				const users = await userRepository.find({ relations: ['user'] });
				const usersResponse: IUser[] = [];
				if (users.length > 0) {
					users.forEach((usr: UserData) => {
						const auxUser: IUser = {
							firstName: usr.firstname,
							lastName: usr.lastname,
							userName: usr.user?.username,
						};
						usersResponse.push(auxUser);
					});
				}
				resolve(usersResponse);
			} catch (err) {
				err.message = `Error al buscar usuarios - ${err.message}`;
				UserLogger.error(err);
				rejects(err);
			}
		});
	}

	static async getUserFromName(userName: string) {
		return new Promise<IUser | null>(async (resolve, reject) => {
			try {
				const userRepository = getRepository(User);
				const userDB = await userRepository.find({ username: userName });
				if (userDB.length > 0) {
					const user: IUser = {
						id: userDB[0].id,
						userName: userDB[0].username,
						firstName: userDB[0].username,
						lastName: userDB[0].username,
						email: userDB[0].username,
						password: userDB[0].password,
						roleId: userDB[0].userType,
						isConfirm: userDB[0].confirmDate !== null,
					};
					resolve(user);
				} else {
					resolve(null);
				}
			} catch (err) {
				reject(err);
			}
		});
	}

	// eslint-disable-next-line no-dupe-class-members
	static async getUserFromId(userId: number) {
		return new Promise<IUser | null>(async (resolve, reject) => {
			try {
				const userRepository = getRepository(User);
				const userDB = await userRepository.find({ id: userId });
				if (userDB.length > 0) {
					const user: IUser = {
						id: userDB[0].id,
						userName: userDB[0].username,
						password: userDB[0].password,
					};
					resolve(user);
				} else {
					reject(null);
				}
			} catch (err) {
				reject(err);
			}
		});
	}

	static async createUser(user: IUser) {
		const userNew = new User();
		userNew.username = user.userName;
		userNew.userType = user.roleId || Role.OWNER;
		userNew.intents = 0;
		userNew.password = user!.password || '';
		const userRepository = getRepository(User);
		const userDB = await userRepository.save(userNew);
		const userData = new UserData();
		userData.firstname = user.firstName || user.userName;
		userData.lastname = user.lastName;
		userData.user = userNew;
		userData.email = user.userName;
		const userDataRepository = getRepository(UserData);
		const userDataDB = await userDataRepository.save(userData);
		const userDBNew: IUser = {
			id: userDB.id,
			userName: userDB.username,
			email: userDB.username,
			firstName: userDataDB.firstname,
			lastName: userDataDB.lastname,
		};
		return userDBNew;
	}

	static async createItemsUser(userType: Role, userId: number) {
		const userRepository = getRepository(User);
		//const itemRepository = getRepository(Item);
		const user = await userRepository.findOne({ id: userId });
		//UserLogger.info(`usuario encontrado ${user?.id}`);
		// TODO: Get items database to user menu
		// const items = await itemRepository.find({
		// 	where: [
		// 		{ id: 1 },
		// 		{ id: 2 },
		// 		{ id: 3 },
		// 		{ id: 4 },
		// 		{ id: 5 },
		// 		{ id: 6 },
		// 		{ id: 7 },
		// 		{ id: 8 },
		// 		{ id: 9 },
		// 		{ id: 10 },
		// 		{ id: 11 },
		// 		{ id: 12 },
		// 	],
		// });
		if (user) {
			// if (user.items === undefined) {
			// 	user.items = [];
			// }
			// for (const item of items) {
			// 	//UserLogger.info('guardando item user', item);
			// 	user.items.push(item);
			// }
			//UserLogger.info(` guardar usuario relation: ${user.items.length}`);
			const resp = await userRepository.save(user);
			//UserLogger.info('resultado del items_user', resp);
		}
	}

	static async changePassword(userId: number, password: string) {
		if (userId) {
			const userRespository = getRepository(User);
			const resultChangePass = await userRespository.update({ id: userId }, { password });
			return true;
		}
	}

	//TODO: implement UPDATE
	static async updateUser(user: IUser): Promise<boolean> {
		return new Promise((resolve, reject) => {
			resolve();
		});
	}

	static async confirmAccount(user: IUser) {
		if (user.id) {
			const userRespository = getRepository(User);
			const resultConfirm = await userRespository.update(
				{
					id: user.id,
				},
				{ confirmDate: utc().toDate() },
			);

			if (resultConfirm) {
				return true;
			}
		}
		return false;
	}

	static async incrementIntentAuth(user: IUser) {
		if (user.id) {
			const userRespository = getRepository(User);
			const userAuth = await userRespository.findOne({ id: user.id });
			//UserLogger.info('user auth', userAuth);
			if (userAuth?.intents !== undefined) {
				const intents = userAuth.intents + 1;
				const resultConfirm = await userRespository.update(
					{
						id: user.id,
					},
					{ intents },
				);

				if (resultConfirm) {
					return intents;
				}
			}
		}
		return 0;
	}

	static async resetIntentAuth(user: IUser) {
		if (user.id) {
			const userRespository = getRepository(User);
			const userAuth = await userRespository.findOne({ id: user.id });
			//UserLogger.info('user auth', userAuth);
			const resultConfirm = await userRespository.update(
				{
					id: user.id,
				},
				{ intents: 0 },
			);

			if (resultConfirm) {
				return true;
			}
		}
	}

	// TODO: Refactor to other class Tokens

	static async generateTokenRegister(tokens: ITokens) {
		const tokenLogin = new Tokens();
		if (tokens.idUser) {
			tokenLogin.idUser = tokens.idUser;
		}

		tokenLogin.token = tokens.token;
		tokenLogin.type = tokens.type;
		tokenLogin.expirationDate = tokens.expirationDate || new Date();

		try {
			const tokenLoginRepository = getRepository(Tokens);

			const tokenDB = await tokenLoginRepository.save(tokenLogin);
			//UserLogger.debug('token>', tokenDB);
			if (tokenDB?.id > 0) {
				return true;
			} else {
				return false;
			}
		} catch (e) {
			UserLogger.debug(e);
			return false;
		}
	}

	static async getTokenRegister(token: string) {
		const tokensRespository = getRepository(Tokens);

		const now = utc().format();
		//UserLogger.debug(now);
		const tokenResp = await tokensRespository.findOne({
			expirationDate: Raw((alias) => `${alias} > '${now}'`),
			token,
			type: TypeToken.Create,
			isUsed: false,
			usedDate: IsNull(),
		});

		if (tokenResp) {
			const user = await this.getUserFromId(tokenResp.idUser);
			return user;
		}

		return null;
	}

	static async generateTokenLogin(tokens: ITokens) {
		const tokenLogin = new Tokens();
		if (tokens.idUser) {
			tokenLogin.idUser = tokens.idUser;
		}

		tokenLogin.token = tokens.token;
		tokenLogin.type = tokens.type;
		tokenLogin.expirationDate = tokens.expirationDate || new Date();

		const tokenLoginRepository = getRepository(Tokens);
		try {
			const tokenDB = await tokenLoginRepository.save(tokenLogin);
			//UserLogger.debug('tokenDB', tokenDB);
			if (tokenDB.id) {
				return true;
			} else {
				return false;
			}
		} catch (e) {
			UserLogger.error(e);
		}
	}

	static async getTokenLogin(token: string) {
		const tokenLoginRespository = getRepository(Tokens);

		const now = utc().format();
		const tokenResp = await tokenLoginRespository.findOne({
			expirationDate: Raw((alias) => `${alias} > '${now}'`),
			token,
			type: TypeToken.Login,
			isUsed: false,
			usedDate: IsNull(),
		});

		if (tokenResp) {
			//UserLogger.debug('tokenResp', tokenResp);
			const user = await this.getUserFromId(tokenResp.idUser);

			return user;
		}

		return null;
	}

	static async changeToken(token: ITokens) {
		const tokenLoginRespository = getRepository(Tokens);
		const restultDB = await tokenLoginRespository.update(
			{
				token: token.token,
			},
			{ isUsed: token.isUsed, usedDate: token.usedDate },
		);

		return true;
	}
}
