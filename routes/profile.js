const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/Usermodel");
const authMiddleware = require("../middlewares/authmiddleware");
require("dotenv").config();

const profileRouter = express.Router();

/**
 * @route   GET /profileview
 * @desc    View logged-in user's profile
 * @access  Private
 */
profileRouter.get("/profileview", authMiddleware(), async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Profile view error:", err.message);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

/**
 * @route   PATCH /profileedit
 * @desc    Edit logged-in user's profile
 * @access  Private
 */


profileRouter.patch("/profileedit", authMiddleware(), async (req, res) => {
  try {
    const allowedUpdates = ["username","profileUrl","name"]; 
    const updates = {};

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields provided for update" });
    }

    const updatedUser = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `${updatedUser.username} your profile updated successfully!`,
      data: updatedUser,
    });
  } catch (err) {
    console.error("Profile edit error:", err.message);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

module.exports = profileRouter;
