const AuctionItem = require("../models/auctionItem");
const Auction = require("../models/auction");

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


exports.getPreviousAuctions = async (hostId) => {
  return AuctionItem.find({
    hostId,
    status: "COMPLETED",
  })
    .populate("sellerId", "name email")
    .sort({ updatedAt: -1 });
};

exports.autoCompleteExpiredAuctions = async () => {
  const now = new Date();

  await AuctionItem.updateMany(
    {
      status: "LIVE",
      $expr: {
        $lt: [
          { $add: ["$startTime", { $multiply: ["$durationMinutes", 60000] }] },
          now,
        ],
      },
    },
    { status: "COMPLETED" }
  );
};
