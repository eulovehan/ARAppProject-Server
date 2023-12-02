import { DataSource, DataSourceOptions } from "typeorm";
import config from "./tools/config";

const entityPath = `${__dirname}/models/**/*`;
console.log("entityPath => ", entityPath);

console.log("config => ", config);
const dataSourceOptions: DataSourceOptions = {
	type: 'mysql',
	host: config.MYSQL.ENDPOINT,
	port: config.MYSQL.PORT,
	username: config.MYSQL.USERNAME,
	password: config.MYSQL.PASSWORD,
	database: config.MYSQL.DATABASE,
	entities: [ `${__dirname}/models/**/*` ],
	charset: 'utf8mb4',
	synchronize: config.MYSQL.SYNCHRONIZE,
	logging: true,
	timezone: config.MYSQL.TIMEZONE,
	relationLoadStrategy: "join",
	cache: false,
	maxQueryExecutionTime: 20000
}

const AppDataSource: DataSource = new DataSource(dataSourceOptions);
export default AppDataSource;