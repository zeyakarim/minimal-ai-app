import { Router } from 'express';
import { login, signUp } from './controllers';

const router = Router();

router.post('/signup', signUp);
router.post('/login', login);

export { router as AuthRoutes };