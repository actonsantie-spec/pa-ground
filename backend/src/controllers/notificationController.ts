import { Request, Response } from 'express';
import prisma from '../prisma/client.js';

export async function sendWhatsApp(req: Request, res: Response) {
  const { phone, message } = req.body;
  // @ts-ignore
  const userId = req.user?.sub;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const notification = await prisma.notification.create({ data: { userId, type: 'whatsapp', payload: { phone, message }, status: 'sent' } });
  res.json({ data: notification });
}
