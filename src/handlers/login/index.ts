import { Request, Response } from 'express';
import { Opcode } from '../../tools/opcode';
import Invalid from '../../tools/invalid';
import AuthController from '../../controllers/auth';

export default class LoginHandler {
	/** 로그인 - post /login */
	public static async postLogin(req: Request, res: Response) {
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

		/** 로그인 */
		const token = await AuthController.login({
			email,
			password
		});
		
		return res.status(200).json({
			opcode: Opcode.Success,
			token
		});
	}
}