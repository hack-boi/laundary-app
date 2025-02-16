const express = require("express");
const { body, validationResult } = require('express-validator');
const { sendOTP, verifyOTP } = require("../controllers/authController");
const { rateLimit } = require('express-rate-limit');

const router = express.Router();

const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false
})

// Route to send OTP
router.post("/send-otp", otpLimiter, [
    body('countryCode').isString().notEmpty().withMessage('Country code is required.'),
    body('phoneNumber').isString().notEmpty().withMessage('Phone number is required.'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: "Validation failed", errors: errors.array() });
    }
    await sendOTP(req, res);
});

// Route to verify OTP
router.post("/verify-otp", [
    body('countryCode').isString().notEmpty().withMessage('Country code is required.'),
    body('phoneNumber').isString().notEmpty().withMessage('Phone number is required.'),
    body('otp').isString().notEmpty().withMessage('OTP is required.'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: "Validation failed", errors: errors.array() });
    }
    await verifyOTP(req, res);
});

// Error handling middleware
router.use((err, req, res, next) => {
    console.error("Route Error:", err.stack || err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

module.exports = router;
