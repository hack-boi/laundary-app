import React, { useState, useEffect } from "react";
import { statusName, statusEmojis } from "../pages/Home";
import { TiTick } from "react-icons/ti";

const OrderStatusTimeline = ({ currentStatus }) => {
    const [currentStep, setCurrentStep] = useState(currentStatus);
    const [complete, setComplete] = useState(false);

    useEffect(() => {
        setCurrentStep(currentStatus);
    }, [currentStatus]);

    return (
        <>
            <div className="flex justify-center items-center align-middle">
                {statusName.map((step, i) => (
                    <div
                        key={i}
                        className={`step-item ${i === currentStep ? "active" : ""} ${(i < currentStep || complete) ? "complete" : ""}`}
                    >
                        <div className="step">
                            {i < currentStep || complete ? <TiTick size={24} /> : statusEmojis[i]}
                        </div>
                    </div>
                ))}
            </div>

            {!complete && (
                <button
                    className="btn"
                    onClick={() => {
                        if (currentStep === statusName.length - 1) {
                            setComplete(true);
                        } else {
                            setCurrentStep((prev) => prev + 1);
                        }
                    }}
                >
                    {currentStep === statusName.length - 1 ? "Finish" : "Next"}
                </button>
            )}
        </>
    );
};

export default OrderStatusTimeline;
