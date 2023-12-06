import Express from 'express';
import { AsyncWrapper } from '../../../tools/wrapper';
import { UserMiddleWare } from '../../../middlewares/user';
import WaterHandler from '../../../handlers/water';

const router = Express.Router();
console.info("api set --> /water");

/** 물 아이템 목록 */
router.get('/list', UserMiddleWare(), AsyncWrapper((req, res) => WaterHandler.list(req, res)));

export default router;