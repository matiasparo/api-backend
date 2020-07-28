import { Entity, Column, Unique, CreateDateColumn, UpdateDateColumn, JoinTable, ManyToMany } from 'typeorm';
import { Length } from 'class-validator';
import { BaseDataEntity } from '@components/business/dal/base-data-entity';

@Entity({ name: 'user' })
@Unique(['username'])
export class User extends BaseDataEntity {
	@Column({ name: 'id_locale', default: null })
	idLocale: number;

	@Column({ name: 'user_type' })
	userType: number;

	@Column({ name: 'intents', default: 0 })
	intents: number;

	@Column({ name: 'change_pass', default: 0 })
	changePass: number;

	@Column({ name: 'active', default: true })
	isActive: boolean;

	@Column({ name: 'username' })
	@Length(4, 20)
	username: string;

	@Column({ name: 'password' })
	@Length(4, 255)
	password: string;

	@Column({ name: 'confirmAt', default: null })
	confirmDate: Date;

	@Column()
	@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	createdAt: Date;

	@Column()
	@UpdateDateColumn({ type: 'timestamp', default: () => '0' })
	updatedAt: Date;

	// @ManyToMany((type) => Item)
	// @JoinTable()
	// items: Item[];
}
