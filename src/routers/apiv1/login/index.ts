import Express from 'express';
import LoginHandler from '../../../handlers/login';

const router = Express.Router();
console.info("api set --> /login");

/** login */
router.post('/', (req, res) => LoginHandler.postLogin(req, res));

export default router;