import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { statusName, statusEmojis } from "../pages/Home";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { UserContext } from "../App";
import { useParams } from "react-router-dom";

const OrderStatusTimeline = ({ currentStatus }) => {

    const { orderId } = useParams();
    const { userAuth: { access_token, role } } = useContext(UserContext);

    const filteredStatusName = statusName.slice(0, statusName.length - 1);

    const [currentStep, setCurrentStep] = useState(currentStatus);
    const [complete, setComplete] = useState(currentStatus === 3);
    const [isCancelled, setIsCancelled] = useState(currentStatus === 4);

    useEffect(() => {
        setCurrentStep(currentStatus);
        if (currentStatus === 4) {
            setIsCancelled(true);
        }
    }, [currentStatus]);

    const updateOrderStatus = async (order_status) => {
        try {
            const { data } = await axios.put(
                `${import.meta.env.VITE_SERVER_DOMAIN}/api/order/update/${orderId}`,
                { order_status },
                {
                    headers: { "Authorization": `Bearer ${access_token}` }
                }
            );
            console.log("Order updated:", data);
        } catch (error) {
            console.error("Error updating order status:", error.response?.data?.error || error.message);
        }
    };

    const handleCancelOrder = async (e) => {
        e.preventDefault();
        setCurrentStep(4);
        setComplete(false);
        setIsCancelled(true);
        await updateOrderStatus(4);
    };

    const handleNextStep = async (e) => {
        e.preventDefault();
        if (currentStep === filteredStatusName.length - 1) {
            setComplete(true);
        } else {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            await updateOrderStatus(nextStep);
        }
    };

    return (
        <>
            <div className="flex justify-between w-full max-w-2xl mx-auto">
                {filteredStatusName.map((name, i) => (
                    <div
                        key={i}
                        className={
                            "step-item " +
                            (isCancelled ? "incomplete " :
                                complete || i < currentStep ? "complete " :
                                    i === currentStep ? "active " : "")
                        }
                    >
                        <div className="step">
                            {isCancelled ? <ImCross size={20} /> :
                                (i < currentStep || complete) ? <TiTick size={24} /> :
                                    statusEmojis[i]}
                        </div>
                        <p className={isCancelled ? "text-red-500 text-sm" : "text-gray-500 text-sm"}>{name}</p>
                    </div>
                ))}
            </div>

            {
                access_token && (
                    <div className="flex justify-center items-center mt-4">
                        {isCancelled ? (
                            <h3 className="text-red-500 text-2xl">
                                Order Cancelled {statusEmojis[currentStep]}
                            </h3>
                        ) : complete ? (
                            <h3 className="text-green-500 text-2xl">
                                Order Completed {statusEmojis[currentStep]}
                            </h3>
                        ) : (
                            <div className="flex gap-6 flex-col mt-4">
                                {
                                    role ? (
                                        <button
                                            className="btn-light shadow-md"
                                            onClick={handleNextStep}
                                        >
                                            {currentStep === filteredStatusName.length + 1 ? "Finish" : "Next"}
                                        </button>
                                    ) : null
                                }
                                <button
                                    className="btn-dark shadow-md bg-red-500"
                                    onClick={handleCancelOrder}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                )
            }
        </>
    );
};

export default OrderStatusTimeline;
