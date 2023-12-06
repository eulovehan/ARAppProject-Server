import AppDataSource from "../dbSource";
import UserModel from "../models/user";
import UserPaymentModel from "../models/user/payment";
import { SQLExceptionError } from "./error";
import nodeSchedule from "node-schedule";

export default class Scheduler {
	/** scheduler modules */
	public static async main() {
		/** 오전 10시마다 발동하는 스케줄러 */
		await Scheduler.tenAM();

		return;
	}

	/** 오전 10시마다 돌아가는 스케줄러 */
	private static async tenAM() {
		console.log("----- schedulingAM10 . .");
		
		const schedulerName: string = "schedulingAM10/*******1";
		const rule = new nodeSchedule.RecurrenceRule();
		rule.hour = 10;
		rule.minute = 0;
		rule.second = 0;

		/** 중첩 제거 */
		nodeSchedule.cancelJob(schedulerName);

		nodeSchedule.scheduleJob(schedulerName, rule, () => {
			console.log(`[Scheduler Action] schedulingAM10/*******1 (${new Date()})`);
			this.schedulingAM10Functions();
		});

		return true;
	}

	/** 오전 10시마다 돌아가는 스케줄러 함수 */
	private static async schedulingAM10Functions() {
		/** 배송 주기 재 설정 */
		await this.setCycle();
	}

	/** 배송 주기 재 설정 */
	public static async setCycle() {
		/** 배송완료 유저 검색 */
		const users = await AppDataSource.getRepository(UserModel)
		.createQueryBuilder("user")
		.select([
			"user.id as id",
			"user.waterId as waterId",
			"user.water_amount as water_amount",
			"user.water_cycle as water_cycle",
			"card.number as card_number"
		])
		.leftJoin("user.card", "card", "card.enabled = true and card.isMainPayment = true")
		.where("NOW() >= date_format(user.water_deliveredAt, '%Y-%m-%d')")
		.getRawMany()
		.catch((err) => {
			throw SQLExceptionError("scheduler.setCycle.user", err);
		});

		for (const user of users) {
			/** 배송 결제 정보 업데이트 */
			const userPayment = new UserPaymentModel({
				userId: user.id,
				waterId: user.waterId,
				water_amount: user.water_amount,
				number: user.card_number
			});

			await userPayment.save()
			.catch((err) => {
				throw SQLExceptionError("scheduler.setCycle.userPayment", err);
			});

			/** 배송 주기 재 설정 */
			await AppDataSource.getRepository(UserModel)
			.createQueryBuilder("user")
			.update(UserModel)
			.set({
				water_deliveredAt: () => `DATE_ADD(NOW(), INTERVAL ${user.water_cycle} DAY)`
			})
			.where("user.id = :userId", { userId: user.id })
			.execute()
			.catch((err) => {
				throw SQLExceptionError("scheduler.setCycle.user", err);
			});
		}
	}
}