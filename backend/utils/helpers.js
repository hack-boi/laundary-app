import jwt from 'jsonwebtoken';

export const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;

export const generateToken = (user) => {

    const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY, { expiresIn: "7d" });
    return {
        access_token,
        fullname: user.personal_info.fullname,
        mobile: user.personal_info.mobile,
        role: user.role,
    }
}