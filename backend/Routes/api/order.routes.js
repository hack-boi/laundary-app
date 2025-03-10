import express from 'express';
import { authenticateAdmin, authenticateUser } from '../../Middleware/auth.middleware.js';
import { createOrder, deleteOrder, updateOrder, getAllOrders, getOrderById, getOrders } from '../../Controllers/order.controller.js';

const orderRoutes = express.Router();

orderRoutes.post('/create', authenticateUser, createOrder);
orderRoutes.get("/get", authenticateUser, getOrders);
orderRoutes.get("/get/:orderId", getOrderById);
orderRoutes.put('/update/:orderId', authenticateUser, updateOrder);
orderRoutes.delete('/delete/:orderId', authenticateUser, deleteOrder);
orderRoutes.get("/all", authenticateAdmin, getAllOrders);

export default orderRoutes;
