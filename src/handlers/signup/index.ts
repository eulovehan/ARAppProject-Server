import { Request, Response } from 'express';
import { Opcode } from '../../tools/opcode';
import Invalid from '../../tools/invalid';
import AuthController from '../../controllers/auth';

export default class SignupHandler {
	/** 회원가입 - post /login */
	public static async postSignup(req: Request, res: Response) {
		const {
			body
		} = req;

		const {
			email,
			password,
			survey_inmate,
			survey_residence,
			survey_taste,
			survey_amount
		} = body;

		Invalid.email(email, {
			title: "이메일"
		});

		Invalid.varchar(password, {
			title: "비밀번호",
			maxLength: 80,
			minLength: 8
		});

		Invalid.varchar(survey_inmate, {
			title: "동거인",
			maxLength: 80,
			minLength: 1,
			nullable: true
		});

		Invalid.varchar(survey_residence, {
			title: "거주지",
			maxLength: 80,
			minLength: 1,
			nullable: true
		});

		Invalid.varchar(survey_taste, {
			title: "맛",
			maxLength: 80,
			minLength: 1,
			nullable: true
		});

		Invalid.varchar(survey_amount, {
			title: "식수량",
			maxLength: 80,
			minLength: 1,
			nullable: true
		});

		/** 회원가입 */
		const token = await AuthController.signup({
			email,
			password,
			survey_inmate,
			survey_residence,
			survey_taste,
			survey_amount
		});
		
		return res.status(200).json({
			opcode: Opcode.Success,
			token
		});
	}
}