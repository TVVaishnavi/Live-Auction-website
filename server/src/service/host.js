const AuctionItem = require("../models/auctionItem");
const AuctionRegistration = require("../models/auctionRegister");
const Bid = require("../models/bid");

exports.getAvailableItems = async () => {
  return AuctionItem.find({ status: "AVAILABLE" })
    .populate("sellerId", "name email");
};

exports.claimItem = async (itemId, hostId) => {
  return AuctionItem.findOneAndUpdate(
    { _id: itemId, status: "AVAILABLE" },
    { hostId, status: "CLAIMED" },
    { new: true }
  );
};

exports.getClaimedItems = async (hostId) => {
  return AuctionItem.find({
    hostId,
    status: "CLAIMED",
  }).populate("sellerId", "name email");
};

exports.scheduleAuction = async (itemId, hostId, data) => {
  const { startTime, meetLink, liveTitle, liveDescription } = data;

  return AuctionItem.findOneAndUpdate(
    { _id: itemId, hostId, status: "CLAIMED" },
    {
      startTime,
      meetLink,
      liveTitle,
      liveDescription,
      status: "SCHEDULED",
    },
    { new: true }
  );
};

exports.publishAuction = async (itemId, hostId) => {
  return AuctionItem.findOneAndUpdate(
    { _id: itemId, hostId, status: "SCHEDULED" },
    { published: true },
    { new: true }
  );
};

exports.getRegistrations = async (auctionKey) => {
  return AuctionRegistration.find({ auctionKey })
    .populate("userId", "name email");
};

exports.getUpcomingAuctions = async (hostId) => {
  return AuctionItem.find({
    hostId,
    status: "SCHEDULED",
    published: true,
    startTime: { $gt: new Date() },
  });
};

exports.startAuction = async (hostId, auctionKey) => {
  return AuctionItem.updateMany(
    {
      hostId,
      status: "SCHEDULED",
      $expr: {
        $eq: [
          { $concat: ["$liveTitle", "-", { $toString: "$startTime" }] },
          auctionKey,
        ],
      },
    },
    { status: "LIVE" }
  );
};


exports.getPreviousAuctions = async (hostId) => {
  return AuctionItem.find({
    hostId,
    status: "CLOSED",
  });
};