import Express from 'express';
import login from './login';
import signup from './signup';

const router = Express.Router();
console.info("APIv1 Router Initializing.");

router.use('/login', login);
router.use('/signup', signup);

export default router;