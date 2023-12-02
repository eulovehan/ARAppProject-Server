export interface Config {
	WEB: {
		HOSTNAME: string;
		PORT: number;
	},
	MYSQL: {
		ENDPOINT: string;
		PORT: number;
		DATABASE: string;
		USERNAME: string;
		PASSWORD: string;
		TIMEZONE: string;
		SYNCHRONIZE: boolean;
	}
}

export const config: Config = require('../../config');
export default config;