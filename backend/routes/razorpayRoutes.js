const express = require("express");
const Razorpay = require("razorpay");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

// ✅ Initialize Razorpay with your API keys
const razorpayInstance = new Razorpay({
  key_id: process.env.VITE_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Route to create a Razorpay order
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;

    if (!amount || isFinite(amount) === false) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const options = {
      amount: amount * 100, // Convert INR to paisa
      currency: currency,
      receipt: `receipt_${Math.floor(Math.random() * 10000)}`,
      payment_capture: 1, // Auto-capture payment
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });

  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
});

// ✅ Export using CommonJS syntax
module.exports = router;
