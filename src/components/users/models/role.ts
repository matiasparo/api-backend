// ADMIN 1
// OWNER 2
// USER 3
export interface IRole {
	id: number;
	name: string;
}

export enum Role {
	ADMIN = 1,
	OWNER = 2,
	USER = 3,
}
