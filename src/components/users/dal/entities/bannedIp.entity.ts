import { Entity, Column } from 'typeorm';
import { BaseDataEntity } from '@components/business/dal/base-data-entity';

@Entity({ name: 'banned_ip' })
export class BannedIp extends BaseDataEntity {
	@Column({ name: 'ip' })
	ip: string;

	@Column({ name: 'user' })
	user: string;

	@Column({ name: 'intents' })
	intents: number;

	@Column({ name: 'date_end', type: 'timestamp' })
	dateEnd: Date;
}
