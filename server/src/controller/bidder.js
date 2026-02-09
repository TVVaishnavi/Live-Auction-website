const bidderService = require("../service/bidder");
const AuctionItem = require("../models/auctionItem");

exports.register = async (req, res) => {
  try {
    const data = await bidderService.registerAuction(
      req.params.auctionId,
      req.user.userId
    );
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.isRegistered = async (req, res) => {
  const registered = await bidderService.isRegistered(
    req.params.auctionId,
    req.user.userId
  );
  res.json({ registered });
};

exports.placeBid = async (req, res) => {
  const bid = await bidderService.placeBid(
    req.params.itemId,
    req.user.userId,
    req.body.amount
  );
  res.json(bid);
};

exports.myRegistrations = async (req, res) => {
  const data = await bidderService.myRegistrations(req.user.userId);
  res.json(data);
};

exports.myWins = async (req, res) => {
  try {
    const userEmail = req.user.email;

    const items = await AuctionItem.find({
      isFinalized: true,
      winnerEmail: userEmail,
    }).populate("auctionId", "title startTime");

    res.json(items);
  } catch (err) {
    console.error("Failed to fetch bidder wins", err);
    res.status(500).json({ message: "Failed to fetch wins" });
  }
};

