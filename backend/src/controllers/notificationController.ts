import { Request, Response } from 'express';

// simple in-memory notifications (can later move to DB or Redis)
let notifications: any[] = [];

export const createNotification = (req: Request, res: Response) => {
  const { userId, message } = req.body;

  const notification = {
    id: Date.now().toString(),
    userId,
    message,
    read: false,
    createdAt: new Date().toISOString(),
  };

  notifications.push(notification);

  return res.status(201).json(notification);
};

export const getNotifications = (req: Request, res: Response) => {
  const { userId } = req.query;

  const userNotifications = notifications.filter(
    (n) => n.userId === userId
  );

  return res.json(userNotifications);
};

export const markAsRead = (req: Request, res: Response) => {
  const { id } = req.params;

  const notification = notifications.find((n) => n.id === id);

  if (!notification) {
    return res.status(404).json({ error: 'Notification not found' });
  }

  notification.read = true;

  return res.json(notification);
};

export default {
  createNotification,
  getNotifications,
  markAsRead,
};