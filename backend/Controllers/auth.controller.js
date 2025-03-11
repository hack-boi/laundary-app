import bcrypt from 'bcrypt';
import { generateToken, mobileRegex, passwordRegex } from '../utils/helpers.js';

import User from '../Models/user.model.js';

export const register = async (req, res) => {
    let { fullname, role, mobile, password } = req.body;

    if (fullname.length < 3) {
        return res.status(400).json({ error: "Fullname must be at least 3 characters long" });
    }

    if (mobile.length !== 10) {
        return res.status(400).json({ error: "Mobile number must be 10 digits long" });
    }

    if (!mobileRegex.test(mobile)) {
        return res.status(400).json({ error: "Enter a valid mobile number" });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: "Password must be 8 to 20 characters long and contain at least one numeric digit, one uppercase and one lowercase letter" });
    }

    if (role === "admin") {
        role = 1;
    } else {
        role = 0;
    }

    try {
        const hashed_password = await bcrypt.hash(password, 10);

        const user = new User({
            personal_info: {
                fullname,
                mobile,
                password: hashed_password
            },
            role,
        });

        const savedUser = await user.save();
        return res.status(201).json(generateToken(savedUser));
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ error: "User with this number already exists" });
        return res.status(500).json({ error: error.message });
    }
}

export const login = async (req, res) => {
    let { mobile, password } = req.body;

    try {
        const user = await User.findOne({ "personal_info.mobile": mobile });
        if (!user) {
            return res.status(400).json({ error: "Mobile number not found" });
        }

        const passwordMatch = await bcrypt.compare(password, user.personal_info.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Incorrect password" });
        }

        return res.status(200).json(generateToken(user));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const getCustomer = async (req, res) => {
    const { customer_id } = req.query;

    if (!customer_id) {
        return res.status(400).json({ error: "Customer ID is required" });
    }

    try {
        const user = await User.findById(customer_id, { "personal_info.password": 0 });

        if (!user) {
            return res.status(404).json({ error: "Customer not found" });
        }

        return res.status(200).json({
            fullname: user.personal_info.fullname,
            mobile: user.personal_info.mobile,
            profile_img: user.personal_info.profile_img
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};
