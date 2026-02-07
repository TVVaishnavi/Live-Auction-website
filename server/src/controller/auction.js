const auctionService = require("../service/auction");
const Auction = require("../models/auction");

exports.createAuction = async (req, res) => {
  const auction = await auctionService.createAuction(
    req.user.userId,
    req.body
  );
  res.json(auction);
};

exports.getPublicUpcomingAuctions = async (req, res) => {
  const auctions = await auctionService.getPublicUpcomingAuctions();
  res.json(auctions);
};

exports.getHostUpcomingAuctions = async (req, res) => {
  const auctions = await auctionService.getHostUpcomingAuctions(
    req.user.userId
  );
  res.json(auctions);
};

exports.startAuction = async (req, res) => {
  const auction = await auctionService.startAuction(
    req.params.auctionId,
    req.user.userId
  );
  res.json(auction);
};

exports.registerForAuction = async (req, res) => {
  try {
    const auction = await auctionService.registerForAuction(
      req.params.auctionId,
      req.user.userId
    );

    res.json({ registered: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getLiveAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.auctionId)
      .populate("items")
      .populate("hostId", "name email");

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    res.json(auction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.nextItem = async (req, res) => {
  const auction = await Auction.findById(req.params.auctionId);

  if (!auction) {
    return res.status(404).json({ message: "Auction not found" });
  }

  auction.currentItemIndex += 1;
  await auction.save();

  res.json({
    currentItemIndex: auction.currentItemIndex,
  });
};

exports.completeItem = async (req, res) => {
  try {
    const { itemId, winner, bids } = req.body;
    await AuctionItem.findByIdAndUpdate(itemId, {
      status: "SOLD",
      winnerName: winner?.userId || null,
      finalPrice: winner?.amount || null,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAuctionById = async (req, res) => {
  const auction = await Auction.findById(req.params.auctionId)
    .populate("items");

  if (!auction) {
    return res.status(404).json({ message: "Auction not found" });
  }

  res.json(auction);
};
