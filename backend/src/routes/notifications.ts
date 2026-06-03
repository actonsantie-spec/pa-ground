import { Router } from 'express';
import { sendWhatsApp } from '../controllers/notificationController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/whatsapp', authenticate, sendWhatsApp);

export default router;
