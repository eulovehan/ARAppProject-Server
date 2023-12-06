import Express from 'express';
import { AsyncWrapper } from '../../../../tools/wrapper';
import UserHandler from '../../../../handlers/user';
import { UserMiddleWare } from '../../../../middlewares/user';

const router = Express.Router();
console.info("api set --> /user/address");

/** 배송지 현황 */
router.get('/info', UserMiddleWare(), AsyncWrapper((req, res) => UserHandler.addressInfo(req, res)));

/** 배송지 수정 */
router.patch('/update', UserMiddleWare(), AsyncWrapper((req, res) => UserHandler.addressUpdate(req, res)));

export default router;