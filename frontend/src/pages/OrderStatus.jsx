import { useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import NoDataMessage from "../components/NoData";
import OrderStatusTimeline from "../components/OrderStatusTimeline";

const OrderStatus = () => {

    const { orderId } = useParams();
    let { userAuth: { access_token } } = useContext(UserContext);

    let [orderDetails, setOrderDetails] = useState(null);

    const fetchOrderDetails = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + `/api/order/get/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
            .then(({ data }) => {
                setOrderDetails(data[0]);
            })
            .catch(({ response }) => {
                console.log(response.data.error);
            })
    }

    useEffect(() => {
        fetchOrderDetails();
    }, []);

    return (
        <AnimationWrapper>
            {
                orderDetails ?
                    <div className="flex flex-col items-center justify-center mt-6">
                        <h1 className="text-2xl md:text-4xl font-gelasio mb-4 capitalize">
                            {orderDetails.title}
                        </h1>

                        <p className="text-gray-500 mb-8">
                            {new Date(orderDetails.created_at).toDateString()}
                        </p>

                        <p className="text-3xl mb-20 text-gray-700">
                            {orderDetails.des}
                        </p>

                        <div className="flex flex-col gap-6 md:gap-10 items-center justify-center w-full px-4 md:px-8 lg:px-16">
                            <OrderStatusTimeline currentStatus={orderDetails.order_status} />
                        </div>
                    </div>
                    :
                    <NoDataMessage message={"No order details to show"} />
            }
        </AnimationWrapper>
    );
}

export default OrderStatus;
