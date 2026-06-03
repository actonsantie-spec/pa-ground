import { Router } from 'express';
import {
  createNotification,
  getNotifications,
  markAsRead,
} from '../controllers/notificationController.js';

const router = Router();

// create notification
router.post('/', createNotification);

// get notifications
router.get('/', getNotifications);

// mark as read
router.patch('/:id/read', markAsRead);

export default router;