import { SysLog } from './entities';
import { getRepository } from 'typeorm';

/**
 * Stored Data Logs
 */
export class SysLogDal {
	static get instance() {
		return this._instance || (this._instance = new SysLogDal());
	}

	// tslint:disable-next-line: variable-name
	private static _instance: SysLogDal;

	// tslint:disable-next-line: no-empty
	constructor() {}

	static log(info: any) {
		const logRepository = getRepository(SysLog);
		const log = new SysLog();
		log.level = info.level;
		log.message = info.message;
		log.meta = info.meta;
		logRepository.save(log);
	}
}
