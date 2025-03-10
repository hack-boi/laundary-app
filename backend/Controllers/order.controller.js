import { nanoid } from 'nanoid';
import Order from '../Models/order.model.js';
import User from '../Models/user.model.js';
import { formattedData } from '../utils/helpers.js';

// ✅ Create Order Controller
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
                    });
            })
            .catch(err => {
                return res.status(500).json({ error: "Failed to create order." });
            });
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

// ✅ Get Orders Controller
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
};

// ✅ Get Order By Order Id Controller
export const getOrderById = async (req, res) => {
    const { orderId } = req.params;

    try {
        Order.findOne({ order_id: orderId })
            .then(order => {
                if (!order) {
                    return res.status(404).json({ error: "Order not found or unauthorized" });
                }

                return res.status(200).json(formattedData([order]));
            })
            .catch(err => {
                return res.status(500).json({ error: "Failed to fetch order." });
            });
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

// ✅ Update Order Controller
export const updateOrder = async (req, res) => {
    const { orderId } = req.params;
    const { title, des, order_status } = req.body;

    if (order_status < 0 || order_status > 4) {
        return res.status(403).json({ error: "You must provide a valid order status" });
    }

    try {
        let updateFields = {};

        if (title !== undefined) updateFields.title = title;
        if (des !== undefined) updateFields.des = des;
        if (order_status !== undefined) updateFields.order_status = order_status;

        if (Object.keys(updateFields).length === 0) {
            return res.status(403).json({ error: "You must provide a valid field to update" });
        }

        const updatedOrder = await Order.findOneAndUpdate(
            { order_id: orderId },
            updateFields,
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ error: "Order not found or unauthorized" });
        }

        res.status(200).json(formattedData([updatedOrder]));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Delete Order Controller
export const deleteOrder = async (req, res) => {
    let customerId = req.user;
    const { orderId } = req.params;

    try {
        const deletedOrder = await Order.findOneAndDelete({ order_id: orderId, customer: customerId });

        if (!deletedOrder) {
            return res.status(404).json({ error: "Order not found or unauthorized" });
        }

        await User.findOneAndUpdate({ _id: customerId }, { $pull: { orders: deletedOrder._id } });

        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete order." });
    }
};

// ✅ Get All Orders Controller
export const getAllOrders = async (req, res) => {
    try {
        Order.find()
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