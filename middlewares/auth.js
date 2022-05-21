const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    if (token && token != "undefined") {
      return await jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        async function (err, decoded) {
          if (err) {
            if (err.name == "TokenExpiredError")
              throw new Error("Session Expired, Please Login Again.");
            throw new Error("Invalid Token Provided, Please Log In Again.");
          }
          let user = await User.findById(decoded._id);
          if (!user) throw new Error("Session Expired, Please Login Again.");
          req.user = user;
          return next();
        }
      );
    }
    throw new Error("Please Log In, To Access This Resource.");
  } catch (err) {
    const { message } = err;
    res.status(401).json({ success: false, message });
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role))
        throw new Error("You are not authorized to access this resource");
      return next();
    } catch (err) {
      const { message } = err;
      return res.status(403).json({ success: false, message });
    }
  };
};
