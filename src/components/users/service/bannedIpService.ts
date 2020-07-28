import { BannedIpDal } from '../dal/bannedIpDal';

export class BannedIpService {
	static async getUserBannedIp(ip: string, user: string) {
		const bannedIp = await BannedIpDal.getbannedIpUser(ip, user);

		return bannedIp;
	}
}
