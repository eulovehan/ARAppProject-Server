import Express from 'express';
import LoginHandler from '../../../handlers/login';
import { AsyncWrapper } from '../../../tools/wrapper';

const router = Express.Router();
console.info("api set --> /login");

/** login */
router.post('/', AsyncWrapper((req, res) => LoginHandler.postLogin(req, res)));

export default router;