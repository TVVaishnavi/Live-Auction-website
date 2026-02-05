const auctionService = require("../service/auction");

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
