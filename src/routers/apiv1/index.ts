import Express from 'express';
import login from './login';

const router = Express.Router();
console.info("APIv1 Router Initializing.");

router.use('/login', login);

export default router;