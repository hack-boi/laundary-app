import express from 'express';
import { login, register, getCustomer } from '../../Controllers/auth.controller.js';
import { authenticateAdmin } from '../../Middleware/auth.middleware.js';

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/customer", authenticateAdmin, getCustomer);

export default authRoutes;
