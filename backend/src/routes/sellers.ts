import { Router } from 'express';
import { listSellers } from '../controllers/sellerController.js';

const router = Router();

router.get('/', listSellers);

export default router;
