const express = require("express");
const { sendOTP, verifyOTP } = require("../controllers/authController");

const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

router.use((err, req, res, next) => {
    console.error("Route Error:", err.stack || err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

module.exports = router;
