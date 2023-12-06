import { Request, Response, NextFunction } from "express";
import { AsyncWrapper } from "../../tools/wrapper";
import { SQLExceptionError, ServerError } from "../../tools/error";
import { Opcode } from "../../tools/opcode";
import AppDataSource from "../../dbSource";
import SessionModel from "../../models/session";

export const UserMiddleWare = () => AsyncWrapper(
	(async (req: Request, res: Response, next: NextFunction) => {
		const {
			headers
		} = req;

		const {
			authorization
		} = headers;

		if (!authorization) {
			throw ServerError("로그인이 필요한 서비스", {
				opcode: Opcode.SessionOut
			});
		}

		const token = authorization.split(" ")[1];
		
		/** 토큰 세션 검색 */
		const session = await AppDataSource.getRepository(SessionModel)
		.createQueryBuilder("session")
		.leftJoinAndSelect("session.user", "user")
		.where("session.token = :token", { token })
		.getOne()
		.catch((err) => {
			throw SQLExceptionError("userMiddleware.findSession", err);
		});

		/** 정보 없으면 반려 */
		if (!session) {
			throw ServerError("로그인이 필요한 서비스", {
				opcode: Opcode.SessionOut
			});
		}
		
		req.user = session.user;
		return next();
	})
);