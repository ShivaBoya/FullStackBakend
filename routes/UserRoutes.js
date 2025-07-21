const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const UserModel = require("../models/UserModel");
const authMiddleware = require("../middlewares/authmiddleware");
const passport = require("passport");
const GitHubStrategy = require("passport-github");
require("dotenv").config();
const UserRouter = express.Router();

// Passport GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/users/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id: githubId, username, emails } = profile;
        const email = emails?.[0]?.value || `${githubId}@github.com`;

        let user = await UserModel.findOne({ email }) || await UserModel.findOne({ profileId: githubId });

        if (!user) {
          user = new UserModel({
            name: username,
            email,
            profileId: githubId,
            authProvider: 'github'
          });
          await user.save();
        }

        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

UserRouter.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

UserRouter.get("/auth/github/callback", passport.authenticate("github", {
  failureRedirect: "/login",
  session: false,
}), (req, res) => {
  const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET_KEY);
  res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
});

UserRouter.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await UserModel.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    user = new UserModel({ name, email, password: hash });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

UserRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

UserRouter.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.userId);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

UserRouter.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '15m' });
    const resetPasswordLink = `${process.env.FRONTEND_URL}/users/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GOOGLE_APP_EMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Shiva Siddu" <${process.env.GOOGLE_APP_EMAIL}>`,
      to: email,
      subject: "Reset Password",
      text: `Click here to reset your password: ${resetPasswordLink}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Reset link sent" });
  } catch (err) {
    res.status(500).json({ message: "Email sending failed", error: err.message });
  }
});

UserRouter.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const hash = await bcrypt.hash(newPassword, 10);

    await UserModel.findByIdAndUpdate(decoded.userId, { password: hash });
    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

module.exports = UserRouter;
