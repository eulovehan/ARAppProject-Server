import AppDataSource from "../dbSource";
import WaterModel from "../models/water";
import { SQLExceptionError } from "./error";
import Scheduler from "./scheduler";

export default class StartModule {
	public static async main() {
		/** generate water items */
		await this.generateWaterItems();

		/** generate schduler */
		await Scheduler.main();
		
		return;
	}

	/** generate water items */
	public static async generateWaterItems() {
		console.log("---------- [StartModule] generate water items")
		const findItems = await AppDataSource.getRepository(WaterModel)
		.createQueryBuilder("water")
		.getMany()
		.catch((err) => {
			throw SQLExceptionError("water.generateWaterItems.water", err);
		});

		if (findItems.length > 0) {
			return true;
		}

		const defaultItems = [
			{
				title: "아이시스 1팩 (2L 6개)",
				price: 6800,
				imageUrl: ""
			},
			{
				title: "삼다수 1팩 (2L 6개)",
				price: 10200,
				imageUrl: ""
			},
			{
				title: "천년 해양심층수 (1.2L 6개)",
				price: 11800,
				imageUrl: ""
			},
			{
				title: "솔의눈 1팩 (240ml 30개)",
				price: 9800,
				imageUrl: ""
			},
			{
				title: "펩시제로 캔 1팩 (355ml 24개)",
				price: 14900,
				imageUrl: ""
			},
		];

		await AppDataSource.getRepository(WaterModel)
		.createQueryBuilder("water")
		.insert()
		.values(defaultItems)
		.execute()
		.catch((err) => {
			throw SQLExceptionError("water.generateWaterItems.insert", err);
		});

		return true;
	}
}