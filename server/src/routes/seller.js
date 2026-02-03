const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const sellerController = require("../controller/seller");

router.post(
  "/",
  requireAuth,
  requireRole("SELLER"),
  sellerController.createItem
);

router.get(
  "/my",
  requireAuth,
  requireRole("SELLER"),
  sellerController.getMyItems
);

module.exports = router;
