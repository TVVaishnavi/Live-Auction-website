const hostService = require("../service/host");

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

exports.myUpcomingAuctions = async (req, res) => {
  try {
    const auctions = await hostService.getUpcomingAuctions(
      req.user.userId
    );
    res.json(auctions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.startAuction = async (req, res) => {
  try {
    const auctionKey = decodeURIComponent(req.params.auctionKey);

    await hostService.startAuction(
      req.user.userId,
      auctionKey
    );

    res.json({ started: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.myPreviousAuctions = async (req, res) => {
  try {
    const auctions = await hostService.getPreviousAuctions(
      req.user.userId
    );
    res.json(auctions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};