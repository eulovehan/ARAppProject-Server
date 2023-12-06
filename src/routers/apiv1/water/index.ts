import Express from 'express';
import { AsyncWrapper } from '../../../tools/wrapper';
import { UserMiddleWare } from '../../../middlewares/user';

const router = Express.Router();
console.info("api set --> /water");

export default router;