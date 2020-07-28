import { getRepository } from 'typeorm';
import { EmailSystem } from './entities/email.entity';
import { IEmail } from '../model';
import { CommunicationLogger } from '../communicationLogger';

export class EmailDal {
	static get instance() {
		return this._instance || (this._instance = new EmailDal());
	}

	// tslint:disable-next-line: variable-name
	private static _instance: EmailDal;

	// tslint:disable-next-line: no-empty
	constructor() {}

	static async generateEmailSystem(email: IEmail) {
		try {
			const emailRepository = getRepository(EmailSystem);
			const emailSys = new EmailSystem();
			emailSys.idUser = email.idUser;
			emailSys.email = email.email;
			emailSys.sended = false;
			emailSys.type = email.type;

			const emailDB = await emailRepository.save(emailSys);
			CommunicationLogger.debug('emailDB');
			CommunicationLogger.debug(JSON.stringify(emailDB));
			const emailRet: IEmail = { ...emailDB };
			CommunicationLogger.debug('emailRet');
			CommunicationLogger.debug(JSON.stringify(emailRet));
			return emailRet;
		} catch (err) {
			CommunicationLogger.error('An error occurred while saving the system email', err);
			return null;
		}
	}

	static async updateEmailSystem(email: IEmail) {
		if (email?.id) {
			const emailRepository = getRepository(EmailSystem);
			const emailDB = await emailRepository.findOne({ id: email?.id });
			if (emailDB) {
				emailDB.messageId = email?.messageId ? email?.messageId : '0000';
				emailDB.sended = true;
				emailDB.sendedDate = email?.sendedDate ? email?.sendedDate : new Date();
				await emailRepository.save(emailDB);
				return true;
			}
		}
		return false;
	}
}
