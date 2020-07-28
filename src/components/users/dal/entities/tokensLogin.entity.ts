import { Entity, Column, CreateDateColumn } from 'typeorm';
import { BaseDataEntity } from '@components/business/dal/base-data-entity';

@Entity({ name: 'tokens' })
export class Tokens extends BaseDataEntity {
	@Column({ name: 'token' })
	token: string;

	@Column({ name: 'user_id' })
	idUser: number;

	@Column({ name: 'type' })
	type: number;

	@Column({ type: 'timestamp', name: 'expiration_date', default: () => '0' })
	expirationDate: Date;

	@CreateDateColumn({ type: 'timestamp', name: 'create_date', default: () => 'CURRENT_TIMESTAMP' })
	createDate: Date;

	@Column({ name: 'used_date', default: null })
	usedDate: Date;

	@Column({ name: 'is_used', default: false })
	isUsed: boolean;
}
