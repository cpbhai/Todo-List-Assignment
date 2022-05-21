const { phoneNumber, isEmail } = require("../utils/validator");
exports.userLogin = (payload) => {
  if (!payload.ID) throw { message: "Phone Or Email is missing" };
  if (!payload.password) throw { message: "Password is missing" };
  if (phoneNumber(payload.ID)) payload.phone = payload.ID;
  else if (isEmail(payload.ID)) payload.email = payload.ID;
  else throw { message: "Invalid Phone Or Email" };
  delete payload.ID;
  return payload;
};

exports.sendOtpValidate = (payload) => {
  if (!payload.ID) throw { message: "Phone or Email is missing" };
  if (phoneNumber(payload.ID)) payload.phone = payload.ID;
  else if (isEmail(payload.ID)) payload.email = payload.ID;
  else throw { message: "Invalid Phone Or Email" };
  delete payload.ID;
  return payload;
};
