import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { fetchChatHistory, sendMessage } from './controllers';

const router = Router();

router.get('/history', authMiddleware, fetchChatHistory);
router.post('/send', authMiddleware, sendMessage);

export { router as ChatRoutes };