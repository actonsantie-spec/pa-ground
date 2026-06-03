import { Router } from 'express';
import { register, login, me } from '../controllers/authController.js';
import { validateBody } from '../middleware/validate.js';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';

const router = Router();

const registerSchema = z.object({ name: z.string(), email: z.string().email(), password: z.string().min(6), role: z.enum(['BUYER', 'SELLER']).optional() });
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.get('/me', authenticate, me);

export default router;
