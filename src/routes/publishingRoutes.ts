import express from 'express';
import { createPost, listPosts } from '../controllers/publishingController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticateToken, createPost);
router.get('/:id', authenticateToken, listPosts);

export default router;