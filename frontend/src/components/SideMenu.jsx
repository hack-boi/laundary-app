import React from "react";
import { statusEmojis } from "../pages/Home";
import OrderStatusTimeline from "./OrderStatusTimeline";

const SideMenu = ({ isOpen, onClose, order }) => {

    if (!order) return null;
    let { created_at, des, id, order_status, title } = order;

    return (
        <div className={`bg-opacity-40 transition-opacity ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
            <div
                className={`fixed right-0 top-48 w-80 bg-yellow-50 border border-gray-600 rounded shadow-lg transform transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">Order Details</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✖</button>
                </div>

                <div className="p-4">
                    <p className="text-gray-400 my-1">{new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                    <h3 className="text-lg font-semibold font-gelasio text-gray-900 capitalize">
                        <span className="text-xl mr-2">{statusEmojis[order_status]}</span>
                        {title}
                    </h3>
                    <p className="text-gray-600 my-2">{des ? des : "No Description to show!"}</p>

                    <OrderStatusTimeline currentStatus={order_status} />
                </div>
            </div>
        </div>
    )
}

export default SideMenu;
