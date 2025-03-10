import axios from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

import { UserContext } from "../App";
import InputBox from "../components/InputBox";
import { storeInSession } from "../common/session";
import AnimationWrapper from "../common/page-animation";

const UserAuthForm = ({ type }) => {

    let [selectedRole, setSelectedRole] = useState("user");
    let { userAuth: { access_token }, setUserAuth } = useContext(UserContext);

    const handleSelectRole = (e) => {
        e.preventDefault();
        setSelectedRole(e.target.value);
    }

    const userAuthThroughServer = async (serverRoute, formData) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
            .then(({ data }) => {
                storeInSession("user", JSON.stringify(data));
                toast.success("Logged in successfully");

                setTimeout(() => {
                    setUserAuth(data);
                }, 1000);
            })
            .catch(({ response }) => {
                toast.error(response.data.error);
            })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        let serverRoute = type == "login" ? "/api/auth/login" : "/api/auth/register";

        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
        let mobileRegex = /^[6-9]\d{9}$/;

        let form = new FormData(formElement);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let { fullname, role, adminKey, mobile, password } = formData;

        if (type !== "login") {
            if (fullname.length < 3) {
                return toast.error("Full name should be atleast 3 letters long");
            }

            if (role === "admin") {
                if (!adminKey) {
                    return toast.error("Admin key is required");
                }

                if (adminKey !== import.meta.env.VITE_SECRET_ADMIN_KEY) {
                    return toast.error("Invalid admin key");
                }
            }
        }

        if (mobile.length !== 10) {
            return toast.error("Mobile number should be 10 digits long");
        }

        if (!mobileRegex.test(mobile)) {
            return toast.error("Enter a valid mobile number");
        }

        if (!passwordRegex.test(password)) {
            return toast.error("Password should be atleast 8 characters long and contain atleast one uppercase letter, one lowercase letter and one number");
        }

        userAuthThroughServer(serverRoute, formData);
    }

    if (access_token) return <Navigate to="/" />;

    return (
        <AnimationWrapper keyValue={type}>
            <section className="py-4 px-[5vw] md:px-[7vw] lg:px-[10vw] min-h-screen flex items-center justify-center">
                <Toaster />
                <form className="w-[80%] max-w-[400px]" onSubmit={handleSubmit} id="formElement">
                    <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                        {type === "login" ? "Welcome back" : "Join us today"}
                    </h1>

                    {type !== "login" && (
                        <>
                            <InputBox
                                name="fullname"
                                type="text"
                                placeholder="Full Name"
                                icon="fi-rr-user"
                            />

                            <div className="relative w-[100%] mb-4">
                                <select name="role" className="input-box" onChange={handleSelectRole}>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <i className="fi fi-rr-user-add input-icon">
                                </i>
                            </div>

                            {/* Ask for admin key on selecting the role as admin */}
                            {
                                selectedRole === "admin" && (
                                    <InputBox
                                        type="password"
                                        name="adminKey"
                                        placeholder="Admin Key"
                                        icon="fi-rr-key"
                                    />
                                )
                            }
                        </>
                    )}

                    <InputBox
                        name="mobile"
                        type="text"
                        placeholder="Mobile Number (10 digits)"
                        icon="fi-rr-smartphone"
                    />

                    <InputBox
                        name="password"
                        type="password"
                        placeholder="Password"
                        icon="fi-rr-key"
                    />

                    <button
                        className="btn-dark center mt-14"
                        type="submit"
                    >
                        {type === "login" ? "Login" : "Register"}
                    </button>

                    <p className="mt-6 text-gray-700 text-xl text-center">
                        {type === "login" ? (
                            <>
                                Don't have an account?
                                <Link to="/register" className="text-black text-xl ml-1 underline">
                                    Join us today
                                </Link>
                            </>
                        ) : (
                            <>
                                Already a member?
                                <Link to="/" className="text-black text-xl ml-1 underline">
                                    Sign in here
                                </Link>
                            </>
                        )}
                    </p>
                </form>
            </section>
        </AnimationWrapper>
    );
};

export default UserAuthForm;
