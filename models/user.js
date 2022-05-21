const mongoose = require("mongoose");
const { phoneNumber, Password, isEmail } = require("../utils/validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      index: { unique: true },
    },
    email: {
      type: String,
      required: true,
      index: { unique: true },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    profile_pic: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
  });
};

//Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.path("phone").validate(function (phone) {
  return phoneNumber(phone);
}, "Phone must be a 10 digit number");

userSchema.path("email").validate(function (email) {
  return isEmail(email);
}, "Invalid email was provided");

userSchema.path("password").validate(function (password) {
  return Password(password);
}, "Password must be equal or greater than 6 characters.");

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
