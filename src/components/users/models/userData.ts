import { IUser } from './user';

export interface IUserData {
	token?: string | null;
	user?: IUser | null;
}
