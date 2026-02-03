const bidderService = require("../service/bidder");

exports.register = async (req, res) => {
  const auctionKey = decodeURIComponent(req.params.auctionKey);

  const reg = await bidderService.registerAuction(
    auctionKey,
    req.user.userId
  );

  res.status(201).json(reg);
};


exports.isRegistered = async (req, res) => {
  const auctionKey = decodeURIComponent(req.params.auctionKey);

  const registered = await bidderService.isRegistered(
    auctionKey,
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
