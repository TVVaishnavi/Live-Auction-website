const express = require("express");
const router = express.Router();
const authService = require("../service/user");
const { requireAuth } = require("../middleware/auth");
const User = require("../models/user");

router.post("/signup", authService.signup);
router.post("/verify-email", authService.verifyEmail);
router.post("/login", authService.login);
router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.userId).select(
    "id name email role"
  );

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  res.json({ user });
});
module.exports = router;
