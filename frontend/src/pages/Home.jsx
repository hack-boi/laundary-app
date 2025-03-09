import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import OrderCard from "../components/OrderCard";
import NoDataMessage from "../components/NoData";
import SideMenu from "../components/SideMenu";
import AnimationWrapper from "../common/page-animation";

export const statusName = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export const statusEmojis = {
    0: "⏳",
    1: "📦",
    2: "🚚",
    3: "✅",
    4: "❌"
}

const Home = () => {

    let [orders, setOrders] = useState(null);
    let [selectedOrder, setSelectedOrder] = useState(null);
    let [isSidebarOpen, setIsSidebarOpen] = useState(false);

    let { userAuth: { access_token } } = useContext(UserContext);

    const fetchOrders = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/api/order/get", {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
            .then(({ data }) => {
                setOrders(data);
            })
            .catch(({ response }) => {
                console.log(response.data.error);
            })
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleOnOrderClick = (order) => {
        setSelectedOrder(order);
        setIsSidebarOpen(true);
    }

    const handleOnBlurOrderUpdate = () => {
        setSelectedOrder(null);
        setIsSidebarOpen(false);
    }

    return (
        <AnimationWrapper>
            <div className="flex flex-col items-center justify-center mt-6">
                <h1 className="text-4xl font-gelasio mb-12">
                    Your Orders
                </h1>
                {
                    orders ?
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {
                                    orders.length ?
                                        orders.map((order, i) => {
                                            return (
                                                <OrderCard order={order} key={i} handleOnOrderClick={handleOnOrderClick} />
                                            )
                                        })
                                        :
                                        <NoDataMessage message={"No orders to show"} />
                                }
                            </div>
                            <SideMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onBlur={handleOnBlurOrderUpdate} order={selectedOrder} />
                        </>
                        :
                        <NoDataMessage message={"No orders to show"} />
                }
            </div>
        </AnimationWrapper>
    );
}

export default Home;
