import express from 'express';
import authRoutes from './api/auth.routes.js';
import orderRoutes from './api/order.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/order', orderRoutes);

export default router;
