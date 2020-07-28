import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ValueTransformer } from 'typeorm';
import { BaseDataEntity } from '@components/business/dal/base-data-entity';

const jsonStringORM: ValueTransformer = {
	from: (dbValue) => {
		let valueReturn = null;
		if (dbValue && dbValue !== '') {
			if (typeof dbValue === 'string') {
				valueReturn = JSON.parse(dbValue);
			} else {
				valueReturn = dbValue;
			}
		}
		return valueReturn;
	},
	to: (entityValue) => {
		let valueReturn = '';
		if (entityValue) {
			if (typeof entityValue === 'object') {
				valueReturn = JSON.stringify(entityValue);
			}
		}

		return valueReturn;
	},
};

@Entity({ name: 'sys_log' })
export class SysLog extends BaseDataEntity {
	@Column({ name: 'level', default: null })
	level: string;

	@Column({ name: 'message', default: null })
	message: string;

	@Column('text', { name: 'meta', default: null, transformer: jsonStringORM })
	meta: object;

	@Column()
	@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	registeredAt: Date;
}
