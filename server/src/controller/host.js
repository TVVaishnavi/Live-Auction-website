const hostService = require("../service/host");
const Auction = require("../models/auction");

exports.availableItems = async (req, res) => {
  const items = await hostService.getAvailableItems();
  res.json(items);
};

exports.claimItem = async (req, res) => {
  const item = await hostService.claimItem(
    req.params.id,
    req.user.userId
  );

  if (!item) {
    return res.status(400).json({ message: "Item not available" });
  }

  res.json(item);
};

exports.myClaimedItems = async (req, res) => {
  const items = await hostService.getClaimedItems(req.user.userId);
  res.json(items);
};

exports.scheduleAuction = async (req, res) => {
  const item = await hostService.scheduleAuction(
    req.params.id,
    req.user.userId,
    req.body
  );
  res.json(item);
};

exports.publishAuction = async (req, res) => {
  const item = await hostService.publishAuction(
    req.params.id,
    req.user.userId
  );
  res.json(item);
};

exports.registrations = async (req, res) => {
  const users = await hostService.getRegistrations(
    req.query.auctionKey
  );
  res.json(users);
};

exports.myPreviousAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({
      hostId: req.user.userId,
      status: "COMPLETED",
    })
      .populate({
        path: "items",
        populate: {
          path: "sellerId",
          select: "name email",
        },
      })
      .sort({ updatedAt: -1 });

    res.json(auctions);
  } catch (err) {
    console.error("Failed to fetch previous auctions", err);
    res.status(500).json({
      message: "Failed to load previous auctions",
    });
  }
};

exports.finalizeItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { winnerName, winnerEmail, finalPrice } = req.body;

    if (!winnerName || !winnerEmail || !finalPrice) {
      return res.status(400).json({
        message: "Winner name, winner email and final price are required",
      });
    }

    const item = await hostService.finalizeItem({
      itemId,
      winnerName,
      winnerEmail,
      finalPrice,
    });

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
