const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../models/Usermodel");
const saltRounds = 9;
const passport = require("passport");
const GitHubStrategy = require("passport-github");
require("dotenv").config();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const blackListTokenModel = require("../models/blackListTokenModel");
const authMiddleware = require("../middlewares/authmiddleware");
const SectionRegistry = require("../config/SectionRegistry");
const TemplateRegistry = require("../config/TemplateRegistry");
const ThemeRegistry = require("../config/ThemeRegistry");



const UserRouter = express.Router();
UserRouter.post("/signup", async (req, res) => {
  try {
    const { name, username, email, password, phone, role } = req.body;

    // ✅ Validation
    if (!name || !username || !email || !password) {
      return res.status(400).json({
        message: "Name, Username, Email, and Password are required",
      });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists with this email" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await UserModel.create({
      name,
      username,
      email,
      password: hashedPassword,
      phone,
      role,
    });

    res.status(201).json({
      message: "Signup Success",
      user: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Signup Error:", err);

    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    if (err.code === 11000) {
      return res.status(409).json({ message: "Duplicate field value entered" });
    }

    res.status(500).json({ message: "Server Error: " + err.message });
  }
});


UserRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found, please signup" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({ message: "Wrong password" });
    }

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    // Return user details along with tokens
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      message: "Login Success",
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

UserRouter.get("/auth/github", passport.authenticate("github"));

UserRouter.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/login",
  }),
  async function (req, res) {
    try {
      const githubId = req.user.id;
      const email =
        req.user.emails?.[0]?.value || `github_${githubId}@example.com`;

      let user = await UserModel.findOne({ profileId: githubId });

      if (!user) {
        user = await UserModel.create({
          profileId: githubId,
          email,
          username: req.user.username || `github_user_${githubId}`,
          password: "github_oauth", // optional placeholder
        });
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role || "user" },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
      );

      res.status(200).json({ message: "GitHub Login Success", token });
    } catch (error) {
      console.error("GitHub login error:", error);
      res.status(500).json({ message: "GitHub login failed" });
    }
  }
);

const transporter = nodemailer.createTransport({
  service: "gmail", // <- use Gmail service here
  auth: {
    user: process.env.GOOGLE_APP_EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});
UserRouter.get("/sendemail", async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: '"Shiva Siddu" <shivasiddu80@gmail.com>',
      to: "shivasiddu80@gmail.com",
      subject: "This is test email send",
      text: "This is text body",
      //html: "<b>This is HTML body</b>",
    });

    res.status(201).json({ message: "Email sent", info });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to send email", error: err.message });
  }
});

UserRouter.post("/forget-password", async (req, res) => {
  try {
    const { email } = req.body;
    let user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiry (10 minutes)
    user.resetOtp = otp;
    user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // Verify casting

    console.log("Saving user with OTP:", otp);
    await user.save({ validateBeforeSave: false });
    console.log("User saved successfully");

    // In production, send via email. Here we send in response for testing.
    // const info = await transporter.sendMail(...)

    console.log(`[MOCK EMAIL] OTP for ${email}: ${otp}`);

    res.json({
      message: "OTP sent to your email",
      mockOtp: otp // Remove this in production!
    });

  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err); // Explicit log prefix
    res.status(500).json({ message: "Something went wrong, please try again later" });
  }
});

UserRouter.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await UserModel.findOne({
      email,
      resetOtp: otp,
      resetOtpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Generate a temporary reset token that is valid for password reset
    const resetToken = jwt.sign(
      { userId: user._id, type: "password_reset" },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" }
    );

    // Clear OTP so it can't be reused immediately (optional, or clear on password reset)
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.json({
      message: "OTP verified successfully",
      resetToken
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Verification failed" });
  }
});

UserRouter.post("/reset-password", async (req, res) => {
  // Now expects a token (from verify-otp) and newPassword
  const { token, newPassword } = req.body;

  try {
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (decoded.type !== "password_reset") {
      return res.status(400).json({ message: "Invalid token type" });
    }

    let user = await UserModel.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (err) {
    console.error(err);
    if (err.name === "TokenExpiredError") {
      res.status(403).json({ message: "Reset session expired, please try again" });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
});
UserRouter.get("/profile", authMiddleware(), async (req, res) => {
  try {
    // ✅ authMiddleware sets req.userId
    const user = await UserModel.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Profile fetch failed:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// --- METADATA ROUTES ---
UserRouter.get("/config/sections", (req, res) => res.json(SectionRegistry));
UserRouter.get("/config/templates", (req, res) => res.json(TemplateRegistry));
UserRouter.get("/config/themes", (req, res) => res.json(ThemeRegistry));

// --- METADATA ROUTES ---
UserRouter.get("/config/sections", (req, res) => res.json(SectionRegistry));
UserRouter.get("/config/templates", (req, res) => res.json(TemplateRegistry));
UserRouter.get("/config/themes", (req, res) => res.json(ThemeRegistry));

module.exports = UserRouter;
