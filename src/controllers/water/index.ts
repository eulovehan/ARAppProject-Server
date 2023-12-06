import AppDataSource from "../../dbSource";
import WaterModel from "../../models/water";
import { SQLExceptionError } from "../../tools/error";

export default class WaterController {
	/** 물 아이템 호출 */
	public static async list(props: {
		page: number;
		amount: number;
	}) {
		const {
			page,
			amount
		} = props;

		const repository = AppDataSource.getRepository(WaterModel)
		.createQueryBuilder("water")
		.select([
			"water.id as id",
			"water.title as title",
			"water.price as price",
			"water.imageUrl as imageUrl",
		]);

		const list = await repository
		.orderBy("water.id", "DESC")
		.offset(page * amount)
		.limit(amount)
		.getRawMany()
		.then((res: Array<{
			id: string;
			title: string;
			price: number;
			imageUrl: string;
		}>) => {
			return res.map((item) => {
				return {
					id: item.id,
					title: item.title,
					price: item.price,
					imageUrl: item.imageUrl
				}
			});
		})
		.catch((err) => {
			throw SQLExceptionError("water.list.list", err);
		});

		const count = await repository
		.getCount()
		.catch((err) => {
			throw SQLExceptionError("water.list.count", err);
		});

		return {
			list,
			count
		}
	}
}