import { nanoid } from 'nanoid';

import Order from '../Models/order.model.js';
import User from '../Models/user.model.js';
import { formattedData } from '../utils/helpers.js';

export const createOrder = async (req, res) => {
    let customerId = req.user;

    const { title, des, order_status } = req.body;

    if (!title.length) {
        return res.status(403).json({ error: "You must provide a title for the order" });
    }

    if (order_status < 0 || order_status > 4) {
        return res.status(403).json({ error: "You must provide a valid order status" });
    }

    const newOrder = new Order({ title, des, order_status, customer: customerId, order_id: nanoid() });
    try {
        await newOrder.save()
            .then(order => {
                User.findOneAndUpdate({ _id: customerId }, { $push: { orders: order._id } })
                    .then(user => {
                        return res.status(200).json({ id: order.order_id });
                    })
                    .catch(err => {
                        return res.status(500).json({ error: "Failed to update order details." });
                    })
            })
            .catch(err => {
                return res.status(500).json({ error: "Failed to create order." });
            });
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}

export const getOrders = async (req, res) => {

    let customerId = req.user;

    try {
        Order.find({ customer: customerId })
            .then(orders => {
                return res.status(200).json(formattedData(orders));
            })
            .catch(err => {
                return res.status(500).json({ error: "Failed to fetch orders." });
            });
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}