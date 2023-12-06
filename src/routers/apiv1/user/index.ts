import Express from 'express';
import { AsyncWrapper } from '../../../tools/wrapper';
import UserHandler from '../../../handlers/user';
import { UserMiddleWare } from '../../../middlewares/user';
import card from './card';
import address from './address';

const router = Express.Router();
console.info("api set --> /user");

/** card extends */
router.use('/card', card);

/** address extends */
router.use('/address', address);

/** 유저 물 정보 */
router.get('/info', UserMiddleWare(), AsyncWrapper((req, res) => UserHandler.info(req, res)));

/** 물 설정 */
router.patch('/setWater', UserMiddleWare(), AsyncWrapper((req, res) => UserHandler.setWater(req, res)));

/** 회원 탈퇴 */
router.delete('/withdrawal', UserMiddleWare(), AsyncWrapper((req, res) => UserHandler.withdrawal(req, res)));

export default router;