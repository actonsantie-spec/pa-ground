import { io } from '../index.js';

export function broadcastOrderCheckpoint(orderId: string, checkpoint: any) {
  io.to(`order_${orderId}`).emit('checkpoint', { orderId, checkpoint });
}
