const express = require("express");
const router = express.Router();
const authService = require("../service/user");

router.post("/signup", authService.signup);
router.post("/verify-email", authService.verifyEmail);
router.post("/login", authService.login);

module.exports = router;
