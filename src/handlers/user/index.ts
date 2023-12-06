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

	/** 카드등록 현황 - get /user/card/cardList */
	public static async cardList(req: Request, res: Response) {
		const {
			user,
			query
		} = req;

		let {
			page,
			amount
		}: any = query;

		page = page ? parseInt(page) : 0;
		amount = amount ? parseInt(amount) : 10;

		const { cards, count } = await UserController.cardList({
			userId: user.id,
			page,
			amount
		});

		return res.status(200).json({
			opcode: Opcode.Success,
			cards,
			count
		});
	}

	/** 카드등록 - post /user/card/registration */
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

	/** 카드등록 해제 - delete /user/card/remove */
	public static async cardRemove(req: Request, res: Response) {
		const {
			user,
			params
		} = req;

		const {
			cardId
		} = params;

		Invalid.varchar(cardId, {
			title: "카드 ID",
			minLength: 36,
			maxLength: 36
		});

		await UserController.cardRemove({
			userId: user.id,
			cardId
		});

		return res.status(200).json({
			opcode: Opcode.Success
		});
	}

	/** 배송지 현황 - get /user/address/info */
	public static async addressInfo(req: Request, res: Response) {
		const {
			user
		} = req;

		const { address, detailAddress, addressPublicPassword } = await UserController.addressInfo(user.id);

		return res.status(200).json({
			opcode: Opcode.Success,
			address,
			detailAddress,
			addressPublicPassword
		});
	}

	/** 배송지 등록 - patch /user/address/update */
	public static async addressUpdate(req: Request, res: Response) {
		const {
			user,
			body
		} = req;

		const {
			address,
			detailAddress,
			addressPublicPassword
		} = body;

		Invalid.varchar(address, {
			title: "주소",
			maxLength: 64
		});

		Invalid.varchar(detailAddress, {
			title: "상세주소",
			maxLength: 255
		});

		Invalid.varchar(addressPublicPassword, {
			title: "공동현관 비밀번호",
			minLength: 2,
			maxLength: 32,
			nullable: true
		});

		await UserController.addressUpdate({
			userId: user.id,
			address,
			detailAddress,
			addressPublicPassword
		});

		return res.status(200).json({
			opcode: Opcode.Success
		});
	}

	/** 회원 탈퇴 - delete /user/withdrawal */
	public static async withdrawal(req: Request, res: Response) {
		const {
			user
		} = req;

		await UserController.withdrawal(user.id);

		return res.status(200).json({
			opcode: Opcode.Success
		});
	}
}