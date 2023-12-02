import { Request, Response, NextFunction } from "express";
import { Opcode } from "./opcode";

export function AsyncWrapper(callback: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
	return async (req: Request, res: Response, next: NextFunction) => {
		let cb = null;
		try {
			cb = await callback(req, res, next);
		} catch (err) {
			cb = await wrapper(req, res, err);
		}
		
		return cb;
	}
}

export function wrapper(req: Request, res: Response, err: any) {
	const {
		opcode,
		message,
		stack
	} = err;

	return res.status(500).json({
		opcode,
		message,
		stack
	});
}