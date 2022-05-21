const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "assets/images" });
const {
  signup,
  login,
  loadUser,
  updateProfile,
  sendOtp,
  loginWithOtp,
} = require("../controllers/user.js");
const { isAuthenticated } = require("../middlewares/auth");

router.post("/signup", upload.single("profile_pic"), signup);
router.post("/login", login);
router.get("/load-user", isAuthenticated, loadUser);
router.put(
  "/settings/update-profile",
  isAuthenticated,
  upload.single("profile_pic"),
  updateProfile
);
router.post("/send-otp", sendOtp);
router.post("/login-with-otp", loginWithOtp);

module.exports = router;
