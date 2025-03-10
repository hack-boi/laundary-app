import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { statusEmojis } from "../pages/Home";
import { UserContext } from "../App";

const OrderCard = ({ order, orderNum, customer }) => {
    let { created_at, des, id, order_status, title } = order;

    let { userAuth: { role } } = useContext(UserContext);

    return (
        <Link
            to={`/order/${id}`}
            className="w-[300px] h-auto rounded-2xl p-6 border border-gray-300 shadow-md 
               hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-white"
        >
            <div className="flex justify-between items-center text-gray-500">
                <span className="font-mono text-sm">Order #{orderNum}</span>
                <span className="text-sm">
                    {new Date(created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
            </div>

            <h3 className="text-lg font-semibold font-gelasio text-gray-900 mt-3 capitalize flex items-center gap-2">
                <span className={`text-xl ${order_status === 4 ? "text-red-500" : "text-green-600"}`}>
                    {statusEmojis[order_status]}
                </span>
                {title}
            </h3>

            {role && customer ? (
                <div className="flex items-center mt-4 gap-3 p-3 rounded-lg bg-gray-100">
                    <img
                        src={customer.profile_img}
                        className="w-10 h-10 rounded-full object-cover border border-gray-300"
                    />
                    <div>
                        <h4 className="text-sm font-semibold text-gray-800">{customer.fullname}</h4>
                        <p className="text-xs text-gray-600">{customer.mobile}</p>
                    </div>
                </div>
            ) : (
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {des ? des : "No description available!"}
                </p>
            )}
        </Link>

    );
};

export default OrderCard;
