import mongoose from "mongoose";
import OrderSchema from "../Schemas/order.schema.js";

const Order = mongoose.model("orders", OrderSchema);

export default Order;
