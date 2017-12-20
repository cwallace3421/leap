import * as bodyparser from 'body-parser';
import * as compression from 'compression';
import * as express from 'express';

class App {

	public express: express.Application;

	constructor() {
		this.express = express();
		this.use();
	}

	private use() {
		this.express.use(<express.RequestHandler> compression());
		this.express.use('/jquery', express.static('node_modules/jquery/dist/'));
		this.express.use('/phaser', express.static('node_modules/phaser-ce/build/'));
		this.express.use('/css', express.static('src/client/css'));
		this.express.use('/dist', express.static('dist/client'));
		this.express.use('/assets', express.static('src/client/assets'));

		this.express.use(bodyparser.json());
		this.express.use(bodyparser.urlencoded({ extended: true }));

		this.express.use(function (err, req, res, next) {
			if (req.xhr) {
				res.status(500).send({
					error: 'Server Error'
				});
			} else {
				next(err);
			}
		});
	}

}

export default new App().express;