import { IRole } from './role';

export interface IUser {
	id?: number;
	userName: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	password?: string;
	roleId?: number;
	isConfirm?: boolean;
}

export class UserMaker {
	static create(event: IUser) {
		return {
			userName: event.userName,
			firstName: event.firstName,
			lastName: event.lastName,
			password: event.password,
			email: event.userName,
			roleId: event.roleId,
			isConfirm: event.isConfirm ? true : false,
		};
	}
}
