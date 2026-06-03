import { Router } from 'express';
import {
  getStats,
  listUsers,
  updateUser,
  listSellersAdmin,
  updateSeller,
  listOrdersAdmin,
  getReports,
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

router.get('/stats', authenticate, requireRole('ADMIN'), getStats);
router.get('/users', authenticate, requireRole('ADMIN'), listUsers);
router.patch('/users/:id', authenticate, requireRole('ADMIN'), updateUser);
router.get('/sellers', authenticate, requireRole('ADMIN'), listSellersAdmin);
router.patch('/sellers/:id', authenticate, requireRole('ADMIN'), updateSeller);
router.get('/orders', authenticate, requireRole('ADMIN'), listOrdersAdmin);
router.get('/reports', authenticate, requireRole('ADMIN'), getReports);

export default router;
