export enum TypeEmail {
	CONFIRM_ACCOUNT = 1,
	RESET_PASSWORD = 2,
}

export interface IEmail {
	id?: number;
	messageId?: string;
	idUser: number;
	email: string;
	type: TypeEmail;
	createDate?: Date;
	sendedDate?: Date;
	sended?: boolean;
}
