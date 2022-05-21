const userModel = require("../models/user");
const otpModel = require("../models/otp");
const errorResponse = require("../utils/errorResponse");
const {
  userLogin,
  sendOtpValidate,
} = require("../middlewares/validatePayload.js");
const mongoose = require("mongoose");
const { Password } = require("../utils/validator");
const SMSOTP = require("../services/otp");
const sendEmail = require("../utils/sendEmail");

exports.signup = async (req, res) => {
  try {
    req.body.profile_pic = req.file.path;
    const user = await userModel.create(req.body);
    user.password = undefined;
    const token = user.getJWTToken();
    res.status(201).json({
      success: true,
      data: user,
      token,
      message: "Successfully signed up",
    });
  } catch (err) {
    const fs = require("fs");
    const filePath = req.body.profile_pic;
    fs.unlinkSync(filePath);
    errorResponse(res, err);
  }
};

exports.login = async (req, res) => {
  try {
    req.body = userLogin(req.body);
    const { password } = req.body;
    delete req.body.password;
    const user = await userModel.findOne(req.body).select("+password");
    if (!user) throw { message: "No Such User Found" };
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) throw { message: "No Such User Found" };
    const token = user.getJWTToken();
    user.password = undefined;
    res.status(200).json({
      success: true,
      data: user,
      token,
      message: "Logged In Successfully",
    });
  } catch (err) {
    errorResponse(res, err);
  }
};

exports.loadUser = (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, password } = req.body;
    if (req.file) {
      const fs = require("fs");
      const filePath = req.user.profile_pic;
      fs.unlinkSync(filePath);
      req.user.profile_pic = req.file.path;
    }
    if (name) req.user.name = name;
    if (password) {
      if (!Password(password))
        throw {
          message: "Password must be equal or greater than 6 characters",
        };
      req.user.password = password;
    }
    req.user.save();
    res
      .status(200)
      .json({ success: true, message: "Profile Updated Successfully." });
  } catch (err) {
    errorResponse(res, err);
  }
};

exports.sendOtp = async (req, res) => {
  try {
    req.body = sendOtpValidate(req.body);
    const user = await userModel.findOne(req.body);
    if (!user) throw { message: "No such user found" };
    const value = Math.floor(
      Math.random() * (9999 - 1000 + 1) + 1000
    ).toString();
    const payload = {
      value,
      trialCount: 3,
      by: user._id,
    };
    if (req.body.phone) SMSOTP.send(value, req.body.phone);
    else sendEmail("send-otp", { email: req.body.email, value });
    const otp = await otpModel.create(payload);
    res.status(200).json({
      success: true,
      message: `OTP was sent successfully `,
      request_id: otp._id,
    });
  } catch (err) {
    errorResponse(res, err);
  }
};

exports.loginWithOtp = (req, res) => {
  try {
    const { request_id, value } = req.body;
    if (!request_id || !mongoose.isValidObjectId(request_id))
      throw { message: "Request id is missing or invalid" };
    otpModel.findById(request_id).exec(async (err, data) => {
      if (!data)
        return res
          .status(400)
          .json({ success: false, message: "Request id is invalid" });
      if (data.trialCount == 0)
        return res.status(400).json({
          success: false,
          message: "OTP has been expired, Please generate another",
        });
      else {
        if (value == data.value) {
          const user = await userModel.findById(data.by);
          const token = user.getJWTToken();
          data.trialCount = 0;
          data.save();
          return res
            .status(200)
            .json({ success: true, token, message: "Logged In Successfully" });
        }
        data.trialCount -= 1;
        data.save();
        return res.status(400).json({
          success: false,
          message: "OTP is invalid",
        });
      }
    });
  } catch (err) {
    errorResponse(res, err);
  }
};
