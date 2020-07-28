import express = require('express');
import path = require('path');

export default class Server {
	app: express.Application;
	port: number;

	constructor(port: number) {
		this.port = port;
		this.app = express();
	}

	static init(port: number): Server {
		return new Server(port);
	}

	// tslint:disable-next-line: ban-types
	start(callback: Function): void {
		this.app.listen(this.port, callback());
		this.publicFolder();
	}

	private publicFolder(): void {
		const publicPath = path.resolve(__dirname, '../public');
		this.app.use(express.static(publicPath));
	}
}
