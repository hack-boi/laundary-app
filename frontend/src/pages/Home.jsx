import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import OrderCard from "../components/OrderCard";
import NoDataMessage from "../components/NoData";
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
    let [customers, setCustomers] = useState({});

    let { userAuth: { access_token, role } } = useContext(UserContext);

    const fetchOrders = (serverRoute) => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
            .then(({ data }) => {
                data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                if (role) {
                    data = data.filter(order => order.order_status !== 3 && order.order_status !== 4);
                }

                const groupedOrders = data.reduce((acc, order) => {
                    if (!acc[order.customer_id]) {
                        acc[order.customer_id] = [];
                    }
                    acc[order.customer_id].push(order);
                    return acc;
                }, {});

                setOrders(groupedOrders);

                if (role) {
                    Object.keys(groupedOrders).forEach(customer_id => fetchCustomer(customer_id));
                }
            })
            .catch(({ response }) => {
                console.log(response.data.error);
            })
    }

    const fetchCustomer = (customer_id) => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/api/auth/customer", {
            params: {
                customer_id
            },
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        })
            .then(({ data }) => {
                setCustomers(prev => ({ ...prev, [customer_id]: data }));
            })
            .catch(({ response }) => {
                console.log(response.data.error);
            })
    }

    useEffect(() => {
        const serverRoute = role ? "/api/order/all" : "/api/order/get";
        fetchOrders(serverRoute);
    }, []);

    return (
        <AnimationWrapper>
            <div className="flex flex-col items-center justify-center mt-6 gap-6 px-4 md:px-8">
                <h1 className="text-4xl font-gelasio mb-12 text-center">
                    {role ? "All Orders" : "Your Orders"}
                </h1>

                {orders && Object.keys(orders).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
                                    gap-6 gap-y-8 w-full max-w-7xl justify-center place-items-center">
                        {Object.keys(orders).map(customer_id =>
                            orders[customer_id].map((order, i) => (
                                <OrderCard
                                    key={`${order.order_id}-${i}`}
                                    order={order}
                                    orderNum={orders[customer_id].length - i}
                                    customer={role ? customers[customer_id] : null}
                                />
                            ))
                        )}
                    </div>
                ) : (
                    <NoDataMessage message="No orders to show" />
                )}
            </div>
        </AnimationWrapper>
    );
}

export default Home;
