import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { verifyJwt } from './utils/jwt.js';
import prisma from './prisma/client.js';

const PORT = process.env.PORT || 4000;
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: process.env.CORS_ORIGIN || '*' } });

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Authentication error'));
  try {
    const payload = verifyJwt(token);
    socket.data.user = payload;
    return next();
  } catch (err) {
    return next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  // eslint-disable-next-line no-console
  console.log('socket connected', socket.id);
  socket.on('subscribeOrder', async (orderId: string) => {
    if (!orderId) return;
    const user = socket.data.user;
    if (!user) return;

    const order = await prisma.order.findUnique({ where: { id: orderId }, include: { seller: { select: { userId: true } } } });
    if (!order) return;

    const isBuyer = user.role === 'BUYER' && order.buyerId === user.sub;
    const isSeller = user.role === 'SELLER' && order.seller?.userId === user.sub;
    const isAdmin = user.role === 'ADMIN';

    if (isAdmin || isBuyer || isSeller) {
      socket.join(`order_${orderId}`);
    }
  });
});

httpServer.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${PORT}`);
});

export { io };
