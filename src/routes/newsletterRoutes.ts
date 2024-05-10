import express from 'express';
import {
  createNewsletterController,
  listNewslettersController,
  updateNewsletterController,
  deleteNewsletterController
} from '../controllers/newsletterController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticateToken, createNewsletterController);
router.get('/', authenticateToken, listNewslettersController);
router.put('/:id', authenticateToken, updateNewsletterController);
router.delete('/:id', authenticateToken, deleteNewsletterController);

export default router;
