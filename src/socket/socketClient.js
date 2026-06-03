import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
let socket = null;
let socketStatus = 'disconnected';
const statusListeners = new Set();
const orderSubscribers = new Map();

function notifyStatus(status, payload) {
  socketStatus = status;
  statusListeners.forEach((listener) => {
    try {
      listener(status, payload);
    } catch (err) {
      console.error('Socket status listener error:', err);
    }
  });
}

export function initSocket() {
  if (typeof window === 'undefined') return null;
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    reconnectionAttempts: 5,
    auth: {
      token: localStorage.getItem('pa_ground_token'),
    },
  });

  notifyStatus('connecting');

  socket.on('connect', () => {
    notifyStatus('connected');
  });

  socket.on('disconnect', (reason) => {
    notifyStatus('disconnected', reason);
  });

  socket.on('connect_error', (error) => {
    notifyStatus('error', error?.message || 'Connection failed');
  });

  socket.on('reconnect_attempt', (attempt) => {
    notifyStatus('reconnecting', attempt);
  });

  socket.on('checkpoint', (payload) => {
    if (!payload || !payload.orderId) return;
    const handlers = orderSubscribers.get(payload.orderId);
    if (!handlers) return;
    handlers.forEach((handler) => {
      try {
        handler(payload);
      } catch (err) {
        console.error('Socket order handler error:', err);
      }
    });
  });

  return socket;
}

export function disconnectSocket() {
  if (!socket) return;
  socket.disconnect();
  socket = null;
  notifyStatus('disconnected');
}

export function subscribeSocketStatus(listener) {
  listener(socketStatus);
  statusListeners.add(listener);
  return () => {
    statusListeners.delete(listener);
  };
}

export function subscribeToOrder(orderId, listener) {
  if (!orderId || typeof listener !== 'function') {
    return () => {};
  }

  const socketInstance = initSocket();
  if (!socketInstance) {
    return () => {};
  }

  const handlers = orderSubscribers.get(orderId) || new Set();
  handlers.add(listener);
  orderSubscribers.set(orderId, handlers);

  socketInstance.emit('subscribeOrder', orderId);

  return () => {
    const existing = orderSubscribers.get(orderId);
    if (!existing) return;
    existing.delete(listener);
    if (existing.size === 0) {
      orderSubscribers.delete(orderId);
    }
  };
}
