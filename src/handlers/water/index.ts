import { Request, Response } from 'express';
import { Opcode } from '../../tools/opcode';
import WaterController from '../../controllers/water';

export default class WaterHandler {
	/** 물 아이템 목록 - get /water/list */
	public static async list(req: Request, res: Response) {
		const {
			query
		} = req;

		let {
			page,
			amount
		}: any = query;

		page = page ? parseInt(page) : 0;
		amount = amount ? parseInt(amount) : 10;

		/** 리스트 호출 */
		const { list: waters, count } = await WaterController.list({
			page,
			amount
		});
		
		return res.status(200).json({
			opcode: Opcode.Success,
			waters,
			count
		})
	}
}