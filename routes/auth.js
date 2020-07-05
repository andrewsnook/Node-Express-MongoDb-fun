const express = require("express");
const passport = require("passport");
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  logout,
} = require("../controllers/auth");

const router = express.Router();

const { protect } = require("../middleware/auth");
const { reset } = require("nodemon");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/me", protect, getMe);
router.put("/updatedetails", protect, updateDetails);
router.put("/updatepassword", protect, updatePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router.get("/twitter", passport.authenticate("twitter"));

router.get(
  "/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("http://localhost:5000/api/v1/recommendations/");
  }
);

module.exports = router;
