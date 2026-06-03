import { Router } from 'express';
import {
  createNotification,
  getNotifications,
  markAsRead,
} from '../controllers/notificationController.js';

const router = Router();

router.post('/', createNotification);
router.get('/', getNotifications);
router.patch('/:id/read', markAsRead);

export default router;