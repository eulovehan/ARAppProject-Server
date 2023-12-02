import Express from "express";
import Os from "os";
import cors from "cors";
import Morgan from "morgan";
import { Opcode } from "../tools/opcode";
import rateLimit from "express-rate-limit";
import { AsyncWrapper } from "../tools/wrapper";
import config from "../tools/config";
import apiv1 from "./apiv1";

const packageJson = require('../../package.json');

const express = Express();
const hostname = Os.hostname();

/** cors set */
express.use(cors({
	credentials: true,
	origin: true
}));

/* JSON Parser */
express.use(Express.json());

/* Body Parser */
express.use(Express.urlencoded({ extended: true }));

/* Morgan Logger */
express.use(Morgan('dev'))
express.use(
	Morgan('combined', {
		stream: { write: (str) => console.info(str) },
	}),
);

/* Header */
express.use((req, res, next) => {
	res.header('X-Cluster-Id', hostname);
	res.header('X-Cluster-Ver', packageJson.version);
	res.header('X-Powered-By', 'waterIV');
	next();
});

/** rateLimit set */
express.use(rateLimit({
	windowMs: (1 * 10) * 1000, // 10s
	max: 512, // single ip max 512 req
	handler(req, res) {
		res.status(429).json({
			opcode: Opcode.RequestLimit,
			message: "너무 잦은 요청을 발생 시켰어요. 잠시 후 다시 시도해주세요.",
			errMessage: null
		});

		return false;
	},
}));

/** root router */
express.get(
	'/',
	AsyncWrapper(async (_req, res) => res.status(200).json({
		opcode: Opcode.Success,
		name: packageJson.name,
		cluster: hostname,
		version: packageJson.version,
	})),
);

express.use('/', apiv1);

express.all('*', (req, res) => res.json({ opcode: Opcode.InvalidRequest, message: 'Invaild API' }));
express.listen(config.WEB.PORT, config.WEB.HOSTNAME, () => {
	console.info(
		`웹 서버가 실행되었어요. (http://${config.WEB.HOSTNAME}:${config.WEB.PORT})`,
	);
});