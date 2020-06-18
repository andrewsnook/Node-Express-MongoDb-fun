const express = require("express");
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");

const router = express.Router();

const { protect } = require("../middleware/auth");
const { reset } = require("nodemon");

router.post("/register", register);
router.post("/login", login);
router.post("/me", protect, getMe);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);
module.exports = router;
