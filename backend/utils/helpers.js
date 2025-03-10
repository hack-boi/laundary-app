import jwt from 'jsonwebtoken';

export const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
export const mobileRegex = /^[6-9]\d{9}$/;

export const generateToken = (user) => {

    const access_token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_ACCESS_KEY, { expiresIn: "30d" });
    return {
        access_token,
        profile_img: user.personal_info.profile_img,
        fullname: user.personal_info.fullname,
        mobile: user.personal_info.mobile,
        role: user.role,
    }
}

export const formattedData = (orders) => {
    return orders.map(order => {
        return {
            id: order.order_id,
            title: order.title,
            des: order.des,
            order_status: order.order_status,
            created_at: order.publishedAt,
            updated_at: order.updatedAt,
            customer_id: order.customer
        }
    })
}