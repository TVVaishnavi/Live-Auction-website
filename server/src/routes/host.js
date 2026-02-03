const router = require("express").Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const hostController = require("../controller/host");
const AuctionItem = require('../models/auctionItem');
router.get(
  "/available",
  requireAuth,
  requireRole("HOST"),
  hostController.availableItems
);

router.post(
  "/:id/claim",
  requireAuth,
  requireRole("HOST"),
  hostController.claimItem
);

router.get(
  "/my/claimed",
  requireAuth,
  requireRole("HOST"),
  hostController.myClaimedItems
);

router.post(
  "/:id/schedule",
  requireAuth,
  requireRole("HOST"),
  hostController.scheduleAuction
);

router.post(
  "/:id/publish",
  requireAuth,
  requireRole("HOST"),
  hostController.publishAuction
);

router.get(
  "/registrations",
  requireAuth,
  requireRole("HOST"),
  hostController.registrations
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

router.get(
  "/my/upcoming",
  requireAuth,
  requireRole("HOST"),
  hostController.myUpcomingAuctions
);

router.post(
  "/:auctionKey/start",
  requireAuth,
  requireRole("HOST"),
  hostController.startAuction
);

router.get(
  "/my/previous",
  requireAuth,
  requireRole("HOST"),
  hostController.myPreviousAuctions
);
module.exports = router;
