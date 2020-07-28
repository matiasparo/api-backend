/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Transport from 'winston-transport';

export class EvoTransport extends Transport {
	private component: any;

	constructor(options: any) {
		super(options);

		if (!options.component) {
			throw new Error('option component is required.');
		}

		this.component = options.component;
	}

	log(info: any, callback: any) {
		// console.log(info);
		setImmediate(() => this.emit('logged', info));

		this.component.log(info);
		if (callback && typeof callback === 'function') {
			callback();
		}
	}
}
