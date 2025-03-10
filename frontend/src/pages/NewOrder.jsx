import React, { useContext, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";

import InputBox from "../components/InputBox";
import { UserContext } from "../App";
import axios from "axios";

const NewOrder = ({ type }) => {

    let { userAuth: { access_token } } = useContext(UserContext);

    let navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (e.target.className.includes("disable")) {
            return;
        }

        let form = new FormData(formElement);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let { title, description } = formData;

        if (!title.length) {
            toast.error("Order title is required!");
            return;
        }

        let loadingToast = toast.loading("Creating new order...");
        e.target.classList.add("disable");

        let newOrder = { title, des: description, order_status: 0 };

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/order/create", newOrder, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
            .then(() => {
                e.target.classList.remove("disable");
                toast.dismiss(loadingToast);
                toast.success("New order created successfully!");

                setTimeout(() => {
                    navigate("/");
                }, 1000);
            })
            .catch(({ response }) => {
                e.target.classList.remove("disable");
                toast.dismiss(loadingToast);
                return toast.error(response.data.error);
            })
    }

    return (
        access_token ?
            <div className="flex justify-center items-center">
                <form id="formElement" className="w-full max-w-md mx-auto bg-gray-50 p-6 mt-10 rounded shadow-md" onSubmit={handleSubmit}>
                    <Toaster />
                    <h2 className="font-medium text-4xl my-10 text-center">
                        <i className="fi fi-rr-edit mr-4 text-2xl"></i>
                        Create New Order
                    </h2>

                    <InputBox
                        name="title"
                        type="text"
                        id="title"
                        placeholder="Enter order title"
                        icon="fi-rr-shopping-cart"
                    />

                    <InputBox
                        name="description"
                        type="text"
                        id="description"
                        placeholder="Enter order description"
                        icon="fi-rr-comment"
                    />

                    <button className="btn-dark my-10 mx-auto block" type="submit">
                        <i className="fi fi-rr-add mr-2"></i>
                        Create Order
                    </button>
                </form>
            </div>
            :
            <Navigate to="/" />
    );
};

export default NewOrder;
