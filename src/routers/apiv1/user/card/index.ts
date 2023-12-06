import Express from 'express';
import { AsyncWrapper } from '../../../../tools/wrapper';
import UserHandler from '../../../../handlers/user';
import { UserMiddleWare } from '../../../../middlewares/user';

const router = Express.Router();
console.info("api set --> /user/card");

/** 카드등록 현황 */
router.get('/list', UserMiddleWare(), AsyncWrapper((req, res) => UserHandler.cardList(req, res)));

/** 카드등록 */
router.post('/registration', UserMiddleWare(), AsyncWrapper((req, res) => UserHandler.cardRegistration(req, res)));

/** 카드등록 해제 */
router.delete('/remove/:cardId', UserMiddleWare(), AsyncWrapper((req, res) => UserHandler.cardRemove(req, res)));

export default router;