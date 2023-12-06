import Express from 'express';
import { AsyncWrapper } from '../../../tools/wrapper';
import UserHandler from '../../../handlers/user';
import { UserMiddleWare } from '../../../middlewares/user';
import card from './card';

const router = Express.Router();
console.info("api set --> /user");

/** card extends */
router.use('/card', card);

/** 유저 물 정보 */
router.get('/info', UserMiddleWare(), AsyncWrapper((req, res) => UserHandler.info(req, res)));

/** 물 설정 */
router.patch('/setWater', UserMiddleWare(), AsyncWrapper((req, res) => UserHandler.setWater(req, res)));

export default router;