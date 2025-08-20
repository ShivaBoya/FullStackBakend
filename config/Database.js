// Shreshth Kumar
// 18:17

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB Error:", err.message);
    console.error("Full Error:", err);
    process.exit(1); // ⬅️ stop server if DB fails
  });

module.exports = mongoose;