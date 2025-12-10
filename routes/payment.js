const express = require("express");
const authMiddleware = require("../middlewares/authmiddleware"); // updated import
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const User = require("../models/Usermodel"); // import User model
const { membershipAmount } = require("../utils/constants");
require("dotenv").config();

const paymentRouter = express.Router();


paymentRouter.post("/paymentcreate", authMiddleware(["user"]), async (req, res) => {
  try {
    const { membershipType } = req.body;

    // Access user info from token payload
    const { userId } = req;

    // Fetch user details from DB
    const user = await User.findById(userId).select("username email");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate membership type
    if (!membershipAmount[membershipType]) {
      return res.status(400).json({ error: "Invalid membership type" });
    }

    // Create Razorpay order
    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100, // in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        username: user.username,
        email: user.email,
        membershipType,
      },
    });

    console.log("Razorpay order created:", order);

    // Save payment record in MongoDB
    const newPayment = new Payment({
      userId, // from token
      orderId: order.id,
      status: order.status || "created",
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await newPayment.save();

    // Send payment details to frontend
    res.json({
      amount: order.amount,
      keyId: process.env.RAZORPAY_KEY_ID,
      currency: order.currency,
      notes: order.notes,
      orderId: order.id,
      paymentRecordId: savedPayment._id,
    });
  } catch (err) {
    console.error("Error creating payment:", err);
    res.status(500).json({ error: "Payment creation failed" });
  }
});

module.exports = paymentRouter;
