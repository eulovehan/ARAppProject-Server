import Express from 'express';
import login from './login';
import signup from './signup';
import user from "./user";
import water from "./water";

const router = Express.Router();
console.info("APIv1 Router Initializing.");

router.use('/login', login);
router.use('/signup', signup);
router.use('/user', user);
router.use('/water', water);

export default router;