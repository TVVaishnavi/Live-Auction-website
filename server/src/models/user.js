const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["BIDDER", "SELLER", "HOST"] },

  emailVerified: {
    type: Boolean,
    default: false,
  },

  emailOtp: String,
  emailOtpExpires: Date,
});


module.exports = mongoose.model("User", userSchema);
