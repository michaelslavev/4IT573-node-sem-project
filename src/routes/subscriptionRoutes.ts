import express from 'express';
import {
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
} from '../controllers/subscriptionController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/subscribe/:id', authenticateToken, subscribeToNewsletter);
router.get('/unsubscribe', unsubscribeFromNewsletter);

export default router;
