import AppDataSource from "../../dbSource";
import UserModel from "../../models/user";
import UserCardModel from "../../models/user/card";
import WaterModel from "../../models/water";
import { SQLExceptionError, ServerError } from "../../tools/error";
import { Opcode } from "../../tools/opcode";

export default class UserController {
	/** 구독중인 물 정보 */
	public static async waterInfo(waterId: string) {
		const water = await AppDataSource.getRepository(WaterModel)
		.createQueryBuilder("water")
		.select([
			"water.title as title",
			"water.price as price"
		])
		.where("water.id = :waterId", { waterId })
		.getRawOne()
		.then((res: {
			title: string;
			price: number;
		}) => {
			return res;
		})
		.catch((err) => {
			throw SQLExceptionError("user.waterInfo.water", err);
		});

		return water;
	}

	/** 생수 정보 변경 */
	public static async setWater(props: {
		userId: string;
		waterId: string;
		water_amount: number;
		water_cycle: number;
	}) {
		const {
			userId,
			waterId,
			water_amount,
			water_cycle
		} = props;

		/** waterId 검증 */
		const water = await AppDataSource.getRepository(WaterModel)
		.createQueryBuilder("water")
		.where("water.id = :waterId", { waterId })
		.getOne()
		.catch((err) => {
			throw SQLExceptionError("user.setWaterOptions.water", err);
		});

		if (!water) {
			throw ServerError("상품이 존재하지 않습니다.", {
				opcode: Opcode.NotExistsWaterId
			});
		}

		/** 배송일 3일전에 변경불가 */
		const isLast3Day = await AppDataSource.getRepository(UserModel)
		.createQueryBuilder("user")
		.where("user.id = :userId", { userId })
		.andWhere("NOW() > DATE_ADD(user.water_deliveredAt, INTERVAL -3 DAY)")
		.getOne()
		.catch((err) => {
			throw SQLExceptionError("user.setWaterOptions.water_lastDeliveredAt", err);
		});

		if (isLast3Day) {
			throw ServerError("배송 3일전에는 변경 불가", {
				opcode: Opcode.NotChangeWaterOptions
			});
		}
		
		await AppDataSource.getRepository(UserModel)
		.createQueryBuilder("user")
		.where("user.id = :userId", { userId })
		.update()
		.set({
			waterId,
			water_amount,
			water_cycle
		})
		.execute()
		.catch((err) => {
			throw SQLExceptionError("user.setWaterOptions.update", err);
		});
		
		return;
	}

	/** 예상 배송일 정보가 없으면 업데이트 */
	public static async deliveryDate(props: {
		userId: string;
		water_deliveredAt: Date;
	}) {
		const {
			userId,
			water_deliveredAt
		} = props;

		await AppDataSource.getRepository(UserModel)
		.createQueryBuilder("user")
		.where("user.id = :userId", { userId })
		.andWhere("user.water_deliveredAt IS NULL")
		.update()
		.set({
			water_deliveredAt
		})
		.execute()
		.catch((err) => {
			throw SQLExceptionError("user.deliveryDate.update", err);
		});

		return;
	}

	/** 카드 등록 */
	public static async cardRegistration(props: {
		userId: string;
		number: string;
		password: string;
		exp_month: string;
		exp_year: string;
		name: string;
		phone: string;
		birth: string;	
	}) {
		const {
			userId,
			number,
			password,
			exp_month,
			exp_year,
			name,
			phone,
			birth
		} = props;

		/** 등록된 카드가 없으면 메인으로 지정 */
		const findMoreCard = await AppDataSource.getRepository(UserCardModel)
		.createQueryBuilder("user_card")
		.where("user_card.userId = :userId", { userId })
		.andWhere("user_card.enabled = :enabled", { enabled: true })
		.getMany()
		.catch((err) => {
			throw SQLExceptionError("user.cardRegistration.findMoreCard", err);
		});

		const isMainPayment = !findMoreCard ? true : false;

		/** 유저 카드 생성 */
		const userCard = new UserCardModel({
			userId,
			number,
			password,
			exp_month,
			exp_year,
			name,
			phone,
			birth,
			isMainPayment,
			enabled: true
		});

		await userCard.save()
		.catch((err) => {
			throw SQLExceptionError("user.cardRegistration.save", err);
		});

		return;
	}
}