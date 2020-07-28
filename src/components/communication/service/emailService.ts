import { SES } from 'aws-sdk';
import { IUser } from '@components/users/models';
import { IEmail, TypeEmail } from '../model';
import { EmailDal } from '../dal/emailDal';
import { CommunicationLogger } from '../communicationLogger';
import { utc } from 'moment';

export class EmailService {
	static async sendEmailRegister(user: IUser, token: string) {
		if (user?.email && user?.id) {
			const email: IEmail = {
				email: user?.email,
				idUser: user?.id,
				type: TypeEmail.CONFIRM_ACCOUNT,
				sended: false,
			};

			const URL_ACTIVATE = `${process.env.URL_SERVICES_BACKEND}/auth/confirm-register/${token}`;

			// TODO: get template to database
			const template = `<div>
                                <h1> TEST DE CORREO PARA CONFIRMAR CUENTA</h1>
                                <p>Hi, ${user?.lastName}</p>
                                <p>follow the link below to activate your account</p>
                                <p><a href="${URL_ACTIVATE}"> Active </a><p/>
                            </div>`;
			try {
				const emailStored = await EmailDal.generateEmailSystem(email);
				if (emailStored !== null) {
					EmailService.sendEmailAWS('Activate Account', template, email)
						.then(async (data) => {
							emailStored.messageId = data.MessageId;
							emailStored.sended = true;
							emailStored.sendedDate = utc(new Date()).toDate();
							await EmailDal.updateEmailSystem(emailStored);
						})
						.catch((err) => {
							CommunicationLogger.error('Error al enviar email con AWS', err);
							CommunicationLogger.error('Error al enviar email con AWS', err.stack);
						});
				}
			} catch (e) {
				CommunicationLogger.error('Error al enviar email con AWS', e);
			}
		}
	}

	static async sendEmailResetPassword(user: IUser, token: string) {
		if (user?.email && user?.id) {
			const email: IEmail = {
				email: user?.email,
				idUser: user?.id,
				type: TypeEmail.RESET_PASSWORD,
				sended: false,
			};

			const URL_ACTIVATE = `${process.env.URL_SERVICES_BACKEND}/auth/reset-password/${token}`;
			const template = `<div>
                                <h1> TEST DE CORREO PARA RESETEAR CONRASEÑA</h1>
                                <p>Hi, ${user?.lastName}</p>
                                <p>follow the link below to reset your password</p>
                                <p><a href="${URL_ACTIVATE}"> Reset </a><p/>
                            </div>`;
			try {
				const emailStored = await EmailDal.generateEmailSystem(email);
				if (emailStored !== null) {
					EmailService.sendEmailAWS('Reset Password', template, email)
						.then(async (data) => {
							emailStored.messageId = data.MessageId;
							emailStored.sended = true;
							emailStored.sendedDate = utc(new Date()).toDate();
							await EmailDal.updateEmailSystem(emailStored);
						})
						.catch((err) => {
							CommunicationLogger.error('Error al enviar email con AWS', err);
							CommunicationLogger.error('Error al enviar email con AWS', err.stack);
						});
				}
			} catch (e) {
				CommunicationLogger.error('Error al enviar email con AWS', e);
			}
		}
	}

	static async sendEmailAWS(subject: string, templateHtml: string, email: IEmail) {
		const params = {
			Destination: {
				ToAddresses: [email.email],
			},
			Message: {
				Body: {
					Html: {
						Charset: 'UTF-8',
						Data: templateHtml,
					},
				},
				Subject: {
					Charset: 'UTF-8',
					Data: subject,
				},
			},
			Source: 'test@gmail.com',
			ReplyToAddresses: ['test@gmail.com'],
		};
		return new SES({ apiVersion: '2010-12-01', region: 'us-east-1' }).sendEmail(params).promise();
	}
}
