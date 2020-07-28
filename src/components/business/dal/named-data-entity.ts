import { Column } from 'typeorm';
import { BaseDataEntity } from './base-data-entity';

export class NamedDataEntity extends BaseDataEntity {
	@Column({ name: 'name', default: null })
	name: string;
}
