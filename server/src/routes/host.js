const router = require("express").Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const hostController = require("../controller/host");

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

router.get(
  "/my/previous",
  requireAuth,
  requireRole("HOST"),
  hostController.myPreviousAuctions
);

router.post(
  "/:itemId/finalize",
  requireAuth,
  requireRole("HOST"),
  hostController.finalizeItem
);


module.exports = router;
