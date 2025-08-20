// server.js
require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("./config/Database"); // ⬅️ already connects

const UserRouter = require("./routes/UserRoutes");
const ResumeRouter = require("./routes/ResumeRoutes");
const profileRouter = require("./routes/profile");
const paymentRouter = require("./routes/payment");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
  res.status(201).json({ message: "This is test route" });
});

app.use("/", profileRouter);
app.use("/users", UserRouter);
app.use("/Resume", ResumeRouter);
app.use("/", paymentRouter);

app.use((req, res) => {
  res.status(200).json({ message: "This request is undefined" });
});

app.get("/login", (req, res) => {
  res.send("Please Login again.....");
});

// ✅ Wait for MongoDB before starting server
mongoose.connection.once("open", () => {
  console.log("✅ MongoDB connection ready");
  app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});
