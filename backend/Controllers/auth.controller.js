import bcrypt from 'bcrypt';
import { generateToken, passwordRegex } from '../utils/helpers.js';

import User from '../Models/user.model.js';

export const register = async (req, res) => {
    let { fullname, mobile, password } = req.body;

    if (fullname.length < 3) {
        return res.status(400).json({ error: "Fullname must be at least 3 characters long" });
    }
    if (mobile.length !== 10) {
        return res.status(400).json({ error: "Mobile number must be 10 digits long" });
    }
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: "Password must be 8 to 20 characters long and contain at least one numeric digit, one uppercase and one lowercase letter" });
    }

    try {
        const hashed_password = await bcrypt.hash(password, 10);

        const user = new User({
            personal_info: {
                fullname,
                mobile,
                password: hashed_password
            }
        });

        const savedUser = await user.save();
        return res.status(201).json(generateToken(savedUser));
    } catch (error) {
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