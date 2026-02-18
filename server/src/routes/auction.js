const router = require("express").Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const auctionController = require("../controller/auction");

router.get("/upcoming", auctionController.getPublicUpcomingAuctions);

router.post(
  "/",
  requireAuth,
  requireRole("HOST"),
  auctionController.createAuction
);

router.get(
  "/my/upcoming",
  requireAuth,
  requireRole("HOST"),
  auctionController.getHostUpcomingAuctions
);

router.post(
  "/:auctionId/start",
  requireAuth,
  requireRole("HOST"),
  auctionController.startAuction
);

router.post(
  "/:auctionId/register",
  requireAuth,
  requireRole("BIDDER"),
  auctionController.registerForAuction
);


router.post(
  "/:auctionId/complete-item",
  requireAuth,
  requireRole("HOST"),
  auctionController.completeItem
);

router.get(
  "/:auctionId",
  requireAuth,
  auctionController.getAuctionById
);

module.exports = router;
