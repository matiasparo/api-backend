export enum TypeToken {
	Login = 1,
	Create = 2,
}

export interface ITokens {
	id?: number;
	token: string;
	idUser: number;
	type: TypeToken;
	expirationDate?: Date;
	createDate?: Date;
	usedDate?: Date;
	isUsed?: boolean;
}
