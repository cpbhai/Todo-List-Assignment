const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
  },
  trialCount: {
    type: Number,
    required: true,
  },
  by: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.models.Otp || mongoose.model("Otp", otpSchema);
