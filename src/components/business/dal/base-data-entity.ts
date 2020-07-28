import { PrimaryGeneratedColumn } from 'typeorm';

export class BaseDataEntity {
	@PrimaryGeneratedColumn()
	id: number;
}
