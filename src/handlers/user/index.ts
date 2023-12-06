import { Request, Response } from 'express';
import { Opcode } from '../../tools/opcode';
import Invalid from '../../tools/invalid';
import UserController from '../../controllers/user';
import moment from 'moment';

export default class UserHandler {
	/** 유저 정보 - get /user/info */
	public static async info(req: Request, res: Response) {
		const {
			user
		} = req;

		/** 남은요일 */
		const leftDay = moment(user.water_deliveredAt).diff(moment(), "days");

		/** 생수이름 */
		const waterTitle = await UserController.waterInfo(user.waterId);
		
		return res.status(200).json({
			opcode: Opcode.Success,
			isSetWater: user.waterId ? true : false,
			leftDay,
			waterTitle,
		});
	}

	/** 생수 옵션 변경 - patch /user/setWater */
	public static async setWater(req: Request, res: Response) {
		const {
			user,
			body
		} = req;

		const {
			waterId,
			amount,
			cycle
		} = body;

		Invalid.varchar(waterId, {
			title: "물 아이템 ID",
			minLength: 36,
			maxLength: 36
		});

		Invalid.number(amount, {
			title: "물 양"
		});

		Invalid.number(cycle, {
			title: "물 배달 주기"
		});

		await UserController.setWater({
			userId: user.id,
			waterId,
			water_amount: amount,
			water_cycle: cycle
		});

		/** 예상 배송일 정보가 없으면 업데이트 */
		if (!user.water_deliveredAt) {
			await UserController.deliveryDate({
				userId: user.id,
				water_deliveredAt: moment().add(cycle, "days").toDate()
			});
		}
		
		return res.status(200).json({
			opcode: Opcode.Success
		});
	}

	/** 카드등록 - post /user/cardRegistration */
	public static async cardRegistration(req: Request, res: Response) {
		const {
			user,
			body
		} = req;

		const {
			number,
			password,
			exp_month,
			exp_year,
			name,
			phone,
			birth
		} = body;

		Invalid.varchar(number, {
			title: "카드번호",
			minLength: 16,
			maxLength: 16
		});

		Invalid.varchar(password, {
			title: "카드비밀번호",
			minLength: 2,
			maxLength: 2
		});

		Invalid.varchar(exp_month, {
			title: "카드유효기간 월",
			minLength: 2,
			maxLength: 2
		});

		Invalid.varchar(exp_year, {
			title: "카드유효기간 년",
			minLength: 2,
			maxLength: 2
		});

		Invalid.varchar(name, {
			title: "이름",
			minLength: 2,
			maxLength: 20
		});

		Invalid.varchar(phone, {
			title: "전화번호",
			minLength: 11,
			maxLength: 11
		});

		Invalid.varchar(birth, {
			title: "생년월일",
			minLength: 8,
			maxLength: 8
		});

		await UserController.cardRegistration({
			userId: user.id,
			number,
			password,
			exp_month,
			exp_year,
			name,
			phone,
			birth
		});

		return res.status(200).json({
			opcode: Opcode.Success
		});
	}
}