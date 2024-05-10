import express from 'express';
import {refreshTokenController, registerController, loginController} from '../controllers/authController';

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/refreshToken', refreshTokenController);

export default router;
