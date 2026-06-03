import { Router } from 'express';
import { createOrder, getOrder, listOrders, updateOrderStatus, addCheckpoint, getTracking } from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

router.post('/', authenticate, createOrder);
router.get('/', authenticate, listOrders);
router.get('/:id', authenticate, getOrder);
router.patch('/:id/status', authenticate, requireRole('SELLER','ADMIN'), updateOrderStatus);
router.post('/:id/checkpoints', authenticate, requireRole('SELLER','ADMIN'), addCheckpoint);
router.get('/:orderId/track', authenticate, getTracking);

export default router;
