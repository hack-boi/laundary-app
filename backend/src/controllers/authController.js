const { TWILIO_SERVICE_SID, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, { lazyLoading: true });
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const sendOTP = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: "Validation failed", errors: errors.array() });
        }

        const { countryCode, phoneNumber } = req.body;

        const otpResponse = await client.verify.v2.services(TWILIO_SERVICE_SID).verifications.create({
            to: `+${countryCode}${phoneNumber}`,
            channel: "sms",
        });

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully!",
            details: otpResponse
        });

    } catch (error) {
        console.error("Twilio Error:", error.stack || error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to send OTP. Please try again.",
        });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: "Validation failed", errors: errors.array() });
        }

        const { countryCode, phoneNumber, otp } = req.body;

        const verificationResponse = await client.verify.v2.services(TWILIO_SERVICE_SID).verificationChecks.create({
            to: `+${countryCode}${phoneNumber}`,
            code: otp,
        });

        if (verificationResponse.status !== "approved") {
            return res.status(400).json({ success: false, message: "Invalid OTP. Please try again." });
        }

        const hashedPhoneNumber = await bcrypt.hash(`${countryCode}${phoneNumber}`, 10);
        const token = jwt.sign({ phoneNumber: hashedPhoneNumber }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully!",
            details: verificationResponse,
            token: token,
        });

    } catch (error) {
        console.error("Twilio Verification Error:", error.stack || error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to verify OTP. Please try again.",
        });
    }
};

module.exports = { sendOTP, verifyOTP };
