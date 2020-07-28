import { SysLogDal } from '../dal/syslogDal';
/**
 * LOGIC BUSINESS USER
 */
export class SysLogService {
	// tslint:disable-next-line: no-empty
	constructor() {}

	static create() {
		return new SysLogService();
	}

	async log(info: any) {
		SysLogDal.log(info);
	}
}
