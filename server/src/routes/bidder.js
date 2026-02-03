const router = require("express").Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const bidderController = require("../controller/bidder");
const AuctionItem = require('../models/auctionItem');

router.post(
  "/:auctionKey/register",
  requireAuth,
  requireRole("BIDDER"),
  bidderController.register
);

router.get(
  "/:auctionKey/is-registered",
  requireAuth,
  bidderController.isRegistered
);

router.post(
  "/:itemId/bid",
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

router.get("/published", async (req, res) => {
  try {
    const items = await AuctionItem.find({ published: true })
      .populate("sellerId", "name email");

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
