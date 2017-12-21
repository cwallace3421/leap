import * as fs from 'fs';
import * as path from 'path';

class ConfigAccessor {

	private config : Config;

	constructor() {
		this.config = <Config> JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'config.json')).toString());
	}

	/**
	 * Get the configuration
	 * @public
	 * @returns {Config}
	 */
	public getConfig() {
		return this.config;
	}

}

interface Config {
	server : {
		port : number;
		tick : number;
		waitTimeout : number;
	};
	room : {
		minSize : number;
		maxSize : number;
		countdown : number;
	};
}

export default new ConfigAccessor().getConfig();