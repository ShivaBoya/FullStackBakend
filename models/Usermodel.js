const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: { type: String },
  role: { type: String, default: "user" },
  profileId: { type: String }, // For GitHub or other social login
});

module.exports = mongoose.model("User", UserSchema);
