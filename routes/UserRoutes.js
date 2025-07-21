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

const UserRouter = express.Router();

// ========== SIGNUP ==========
UserRouter.post("/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ message: "Email, Username, and Password are required" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists with this email" });
    }

    bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (err) {
        return res.status(500).json({ message: "Error hashing password" });
      }

      await UserModel.create({ username, email, password: hash, role });
      res.status(201).json({ message: "Signup Success" });
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
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
      { expiresIn: "30s" }
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
      res.status(404).json({ message: "User not found" });
    } else {
      const resetToken = jwt.sign(
        { userId: user._id, role: user.role || "user" },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
      );
      let resetPasswordlink = `http://localhost:3000/users/reset-password?token=${resetToken}`;
      // const info = await transporter.sendMail({
      //   from: '"Shiva Siddu" <shivasiddu80@gmail.com>',
      //   to: user.email,
      //   subject: "password reset link",
      //   html: `<p>Dear ${user.username} , here is the password resect link, please finish the process within 20minutes</p>
      //   <h4>${resetPasswordlink}</h4> `,
      // });

      res.json({
        message: "Password Rest link To sent  Registerd Email",
        resetPasswordlink,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Somthing went , please try again later" });
  }
});

UserRouter.post("/reset-password", async (req, res) => {
  const { token } = req.query;
  const { newPassword } = req.body;
  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded) {
      console.log(decoded);
      let user = await UserModel.findById(decoded.userId);
      // user.password = newPassword;
      // await user.save();
      bcrypt.hash(newPassword, saltRounds, async function (err, hash) {
        if (err) {
          return res.status(500).json({ message: "Error hashing password" });
        } else {
          user.password = hash;
          await user.save();
          await blackListTokenModel.create({ token });
          res.json({ message: "password reset succesful" });
        }
      });
      //  console.log(user)
    }
  } catch (err) {
    if (err.message == "jwt expired") {
      res.status(403).json({
        message:
          "Password reset link, expired please click forget password again",
      });
    } else {
      res
        .status(500)
        .json({ message: " Somthing went wrong , please try again later" });
    }
  }
  //res.json({message:"Password reset succesful"})
});




UserRouter.put("/update", authMiddleware(), async (req, res) => {
  const { name, email, location, profession, password } = req.body;

  try {
    const updates = { name, email, location, profession };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updates.password = hashedPassword;
    }

    await UserModel.findByIdAndUpdate(req.user.userId, updates);
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ message: "Failed to update user" });
  }
});


module.exports = UserRouter;
