import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { registerValidation, loginValidation } from '../middleware/validators';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Initialize controller (will lazy-load AuthService)
const authController = new AuthController();

// Routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/me', authMiddleware, authController.getMe);

export default router;
