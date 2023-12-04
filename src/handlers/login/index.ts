import { Request, Response } from 'express';
import { Opcode } from '../../tools/opcode';
import Invalid from '../../tools/invalid';

export default class LoginHandler {
	/** 로그인 - post /login */
	public static postLogin(req: Request, res: Response) {
		const {
			body
		} = req;

		const {
			email,
			password
		} = body;

		Invalid.email(email, {
			title: "이메일"
		});

		Invalid.varchar(password, {
			title: "비밀번호",
			maxLength: 80,
			minLength: 8
		});
		
		return res.status(200).json({
			opcode: Opcode.Success
		});
	}
}