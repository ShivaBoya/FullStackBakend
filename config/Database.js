// Shreshth Kumar
// 18:17

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => {
  console.error("MongoDB Error:", err.message);
  console.error("Full Error:", err);   // Logs full error details
});

module.exports = mongoose;
