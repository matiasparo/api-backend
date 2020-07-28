import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { BaseDataEntity } from '@components/business/dal/base-data-entity';

@Entity({ name: 'user_data' })
export class UserData extends BaseDataEntity {
	@OneToOne((type) => User)
	@JoinColumn({ name: 'id_user' })
	user: User;

	@Column({ name: 'firstname' })
	firstname: string;

	@Column({ name: 'lastname', default: '' })
	lastname?: string;

	@Column({ name: 'email' })
	email: string;

	@Column({ name: 'phone' })
	phone: string;

	@Column({ name: 'sex' })
	sex: string;

	@Column({ name: 'nif' })
	nif: string;

	@Column({ name: 'address' })
	address: string;

	@Column({ name: 'poust_code' })
	poustCode: number;

	@Column({ name: 'id_country' })
	idCountry: number;

	@Column({ name: 'province' })
	province: string;

	@Column({ name: 'city' })
	city: string;

	@Column()
	@CreateDateColumn({ type: 'timestamp', name: 'createdAt', default: () => 'CURRENT_TIMESTAMP' })
	createdAt: Date;

	@Column()
	@UpdateDateColumn({ type: 'timestamp', default: () => '0' })
	updatedAt: Date;
}
