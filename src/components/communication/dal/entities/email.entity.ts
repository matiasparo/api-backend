import { Entity, Column, CreateDateColumn } from 'typeorm';
import { BaseDataEntity } from '@components/business/dal/base-data-entity';

@Entity({ name: 'emails_system' })
export class EmailSystem extends BaseDataEntity {
	@Column({ name: 'message_id', default: null })
	messageId: string;

	@Column({ name: 'user_id' })
	idUser: number;

	@Column({ name: 'email' })
	email: string;

	@Column({ name: 'type' })
	type: number;

	@CreateDateColumn({ type: 'timestamp', name: 'create_date', default: () => 'CURRENT_TIMESTAMP' })
	createDate: Date;

	@Column({ name: 'sended_date', default: null })
	sendedDate: Date;

	@Column({ name: 'sended', default: false })
	sended: boolean;
}
