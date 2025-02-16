const { TWILIO_SERVICE_SID, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;

const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
    lazyLoading: true,
});

const sendOTP = async (req, res) => {
    try {
        const { countryCode, phoneNumber } = req.body;

        if (!countryCode || !phoneNumber) {
            return res.status(400).json({ success: false, message: "Country code and phone number are required." });
        }

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
        return res.status(error?.status || 500).json({
            success: false,
            message: "Failed to send OTP. Please try again.",
            error: error.message || "Unknown error",
        });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { countryCode, phoneNumber, otp } = req.body;

        if (!countryCode || !phoneNumber || !otp) {
            return res.status(400).json({ success: false, message: "Country code, phone number, and OTP are required." });
        }

        const verificationResponse = await client.verify.v2.services(TWILIO_SERVICE_SID).verificationChecks.create({
            to: `+${countryCode}${phoneNumber}`,
            code: otp,
        });

        if (verificationResponse.status !== "approved") {
            return res.status(400).json({ success: false, message: "Invalid OTP. Please try again." });
        }

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully!",
            details: verificationResponse,
        });

    } catch (error) {
        console.error("Twilio Verification Error:", error.stack || error.message);
        return res.status(error?.status || 500).json({
            success: false,
            message: "Failed to verify OTP. Please try again.",
            error: error.message || "Unknown error",
        });
    }
};

module.exports = { sendOTP, verifyOTP };
