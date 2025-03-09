import express from 'express';
import { authenticateUser } from '../../Middleware/auth.middleware.js';
import { createOrder, getOrders } from '../../Controllers/order.controller.js';

const orderRoutes = express.Router();

orderRoutes.post('/create', authenticateUser, createOrder);
orderRoutes.get("/get", authenticateUser, getOrders);

export default orderRoutes;
