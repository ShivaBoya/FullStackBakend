
const cors = require("cors")
const express = require("express");
const connectToDB = require("./config/Database");
const UserRouter = require("./routes/UserRoutes");
const ResumeRouter = require("./routes/ResumeRoutes");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors())
connectToDB();
app.use(express.json());

app.get("/test", (req, res) => {
  try {
    res.status(201).json({ message: "This is test route" });
  } catch (err) {
    res.status(500).json({ message: "Somthing went wrong" });
  }
});

app.use("/users", UserRouter);
app.use("/Resume", ResumeRouter);

app.use((req, res) => {
  try {
    res.status(200).json({ message: "This request is undefind" });
  } catch (err) {
    res.status(500).json({ messgae: "Somthing went wrong " });
  }
});

app.get("/login", (req, res) => {
  res.send("Please Login again.....");
});

app.listen(PORT, () => {
  console.log(`Server started ${PORT}`);
});
