import Express from 'express';
import SignupHandler from '../../../handlers/signup';
import { AsyncWrapper } from '../../../tools/wrapper';

const router = Express.Router();
console.info("api set --> /signup");

/** login */
router.post('/', AsyncWrapper((req, res) => SignupHandler.postSignup(req, res)));

export default router;