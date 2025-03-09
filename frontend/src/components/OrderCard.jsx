import React from "react";
import { statusEmojis } from "../pages/Home";

const OrderCard = ({ order, handleOnOrderClick }) => {
    let { created_at, des, id, order_status, title } = order;

    return (
        <div 
            className="w-[340px] h-[150px] rounded-2xl p-6 border border-gray-400 cursor-pointer"
            onClick={() => handleOnOrderClick(order)}
        >
            <div className="flex justify-between items-center text-gray-500 gap-8">
                <span className="font-mono text-sm">Order #{id}</span>
                <span className="text-sm">{new Date(created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
            </div>

            <h3 className="text-lg font-semibold font-gelasio text-gray-900 mt-2 capitalize">
                <span className="text-xl mr-2">{statusEmojis[order_status]}</span>
                {title}
            </h3>

            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {des ? des : "No description available!"}
            </p>
        </div>
    );
};

export default OrderCard;
