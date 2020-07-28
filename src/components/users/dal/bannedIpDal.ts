import { BannedIp } from './entities';
import { getRepository, MoreThan } from 'typeorm';
import { UserLogger } from '../usersLogger';
import { IBannedIp } from '../models';
import { utc } from 'moment';

/**
 * Stored Data User
 */
export class BannedIpDal {
	static async bannedIpUser(ip: string, intents: number, user: string) {
		UserLogger.warning(`USER ID: ${user} BANNED FROM IP: ${ip} - INTENTS: ${intents}`);

		const userBannedIP = new BannedIp();
		userBannedIP.user = user;
		userBannedIP.intents = intents;
		userBannedIP.ip = ip;
		const minutesBlocked = parseInt(process.env.MINUTES_BLOCKED_IP_MAX_INTENTS_LOGIN!, 10) || 5;
		const dateEnd = utc(new Date()).add(minutesBlocked, 'minutes').toDate();
		//UserLogger.info(`fecha para habilitar: ${dateEnd}`);
		userBannedIP.dateEnd = dateEnd;

		const userBannedRespository = getRepository(BannedIp);
		const userBannedIpDB = await userBannedRespository.save(userBannedIP);
		if (userBannedIpDB.id) {
			const bannedIp: IBannedIp = {
				ip: userBannedIP?.ip,
				user: userBannedIP?.user,
				dateEnd: userBannedIP.dateEnd,
				intents: userBannedIP.intents,
			};
			return bannedIp;
		} else {
			return null;
		}
	}

	static async getbannedIpUser(ip: string, user: string) {
		//UserLogger.info(`CHECK BANNED USER ID: ${user} FROM IP: ${ip}`);
		const userBannedRespository = getRepository(BannedIp);
		const now = utc(new Date()).toDate();
		//UserLogger.info('fecha a comparar', now);
		const userBannedIp = await userBannedRespository.findOne({
			dateEnd: MoreThan(now),
			user,
			ip,
		});
		if (userBannedIp) {
			const bannedIp: IBannedIp = {
				ip: userBannedIp?.ip,
				user: userBannedIp?.user,
				dateEnd: userBannedIp.dateEnd,
				intents: userBannedIp.intents,
			};
			//UserLogger.info('usuario banneado', bannedIp);
			return bannedIp;
		}

		return null;
	}
}
