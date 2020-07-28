/* eslint-disable no-undef */

import { UserService } from '../service/usersService';
import { createConnection } from 'typeorm';
import { IUser } from '../models';

const usernameRandom = `userTest_${new Date().getTime()}`;
const passwordRandom = '123456';
// inicia conexion database
beforeAll(async () => {
	await createConnection();
});

describe('Get Users', () => {
	const uServ = UserService.create();
	test('Get users', async () => {
		const result = await uServ.getUsers();
		expect(result.length).toBeGreaterThan(0);
	});

	test('Get User matiasparo', async () => {
		const userId = 1;
		const result = await uServ.getUser(userId);
		expect(result).not.toBeNull();
	});
});

describe('Create User', () => {
	const uServ = UserService.create();
	const userTest: IUser = { firstName: 'Test', userName: usernameRandom, password: passwordRandom, lastName: 'Test' };

	test('Create user', async () => {
		const userCreate = await uServ.createUser(userTest);
		expect(userCreate.id).not.toBeNull();
	});

	test('check username', async () => {
		const existResult = { ok: false, message: 'user_already_exists' };
		let userExist = null;
		try {
			userExist = await uServ.createUser(userTest);
		} catch (e) {
			userExist = e;
		}

		expect(userExist).toEqual(existResult);
	});
});

describe('Login user', () => {
	const uServ = UserService.create();

	test('User non active account ', async () => {
		const usrAuth = { userName: usernameRandom, password: passwordRandom };
		const nonActivate = { ok: false, message: 'error_no_active' };
		let userLogin = null;
		try {
			userLogin = await uServ.authUser(usrAuth);
		} catch (e) {
			userLogin = e;
		}

		expect(userLogin).toEqual(nonActivate);
	});
	
});
