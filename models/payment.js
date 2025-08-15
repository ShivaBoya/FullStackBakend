const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    paymentId: {
      type: String, // Payment gateway transaction ID
      default: null,
    },
    orderId: {
      type: String,
      required: true, // Order ID from payment gateway
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true, // e.g., "paid", "failed", "pending"
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
    receipt: {
      type: String,
      required: true,
    },
    notes: {
      firstName: { type: String },
      lastName: { type: String },
      membershipType: { type: String }, // e.g., "premium", "basic"
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

module.exports = mongoose.model("Payment", paymentSchema);
