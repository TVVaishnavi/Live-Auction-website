const AuctionItem = require("../models/auctionItem");
const AuctionRegistration = require("../models/auctionRegister");
const Bid = require("../models/bid");

exports.registerAuction = async (auctionKey, userId) => {
  return AuctionRegistration.create({
    auctionKey,
    userId,
  });
};

exports.isRegistered = async (auctionKey, userId) => {
  const reg = await AuctionRegistration.findOne({
    auctionKey,
    userId,
  });
  return !!reg;
};

exports.placeBid = async (itemId, userId, amount) => {
  return Bid.create({
    auctionItemId: itemId,
    bidderId: userId,
    amount,
  });
};

exports.myRegistrations = async (userId) => {
  const regs = await AuctionRegistration.find({ userId });

  const auctionKeys = regs.map(r => r.auctionKey);

  const items = await AuctionItem.find({
    published: true,
    $expr: {
      $in: [
        { $concat: ["$liveTitle", "-", { $toString: "$startTime" }] },
        auctionKeys,
      ],
    },
  });

  return items.map(item => ({
    auctionKey: `${item.liveTitle}-${item.startTime.toISOString()}`,
    auctionItemId: item,
  }));
};
