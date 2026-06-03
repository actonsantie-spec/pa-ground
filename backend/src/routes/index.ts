import { Router } from 'express';
import health from './health.js';
import auth from './auth.js';
import products from './products.js';
import orders from './orders.js';
import sellers from './sellers.js';
import admin from './admin.js';
import uploads from './uploads.js';
import notifications from './notifications.js';

const router = Router();

router.use('/health', health);
router.use('/auth', auth);
router.use('/products', products);
router.use('/orders', orders);
router.use('/sellers', sellers);
router.use('/admin', admin);
router.use('/uploads', uploads);
router.use('/notifications', notifications);

export default router;
