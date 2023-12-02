import Async from "async";
import AppDataSource from "./dbSource";

/** system boot */
Async.series([
	/** database boot */
	(callback) => {
		console.info("Database Connection Initializing...");
		AppDataSource.initialize()
		.then(() => {
			console.info("Database Connection Initialized.");
			return callback(null);
		})
		.catch((err) => {
			console.log(err);
			return callback(err);
		});
	},
	
	/** express boot */
	(callback) => {
		import('./routers/index')
		.then(() => {
			return callback(null);
		})
		.catch((err) => {
			console.log(err);
			return callback(err);
		});
	}
], (err) => {
	if (err) {
		console.error("System Boot Failed.");
		console.error(err);
		process.exit(1);
	}
});