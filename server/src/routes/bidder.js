const router = require("express").Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const bidderController = require("../controller/bidder");

router.post(
  "/auctions/:auctionId/register",
  requireAuth,
  requireRole("BIDDER"),
  bidderController.register
);

router.get(
  "/auctions/:auctionId/is-registered",
  requireAuth,
  bidderController.isRegistered
);

router.post(
  "/items/:itemId/bid",
  requireAuth,
  requireRole("BIDDER"),
  bidderController.placeBid
);

router.get(
  "/my/registrations",
  requireAuth,
  requireRole("BIDDER"),
  bidderController.myRegistrations
);

module.exports = router;
