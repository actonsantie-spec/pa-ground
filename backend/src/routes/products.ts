import { Router } from 'express';
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', authenticate, requireRole('SELLER'), createProduct);
router.patch('/:id', authenticate, requireRole('SELLER'), updateProduct);
router.delete('/:id', authenticate, requireRole('SELLER'), deleteProduct);

export default router;
