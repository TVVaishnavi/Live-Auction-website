const Auction = require("../models/auction");
const AuctionItem = require("../models/auctionItem");

exports.createAuction = async (hostId, data) => {
  const { title, description, startTime, endTime, meetLink, itemIds } = data;

  const auction = await Auction.create({
    title,
    description,
    hostId,
    startTime,
    endTime,
    meetLink,
    status: "UPCOMING",
    items: itemIds,
  });

  await AuctionItem.updateMany(
    { _id: { $in: itemIds }, hostId },
    {
      auctionId: auction._id,
      status: "ASSIGNED",
    }
  );

  return auction;
};

exports.getPublicUpcomingAuctions = async () => {
  return Auction.find({
    status: "UPCOMING",
    startTime: { $gt: new Date() },
  })
    .populate("items")
    .populate("hostId", "name email")
    .sort({ startTime: 1 });
};

exports.getHostUpcomingAuctions = async (hostId) => {
  return Auction.find({
    hostId,
    status: "UPCOMING",
  })
    .populate("items")
    .sort({ startTime: 1 });
};

exports.startAuction = async (auctionId, hostId) => {
  return Auction.findOneAndUpdate(
    { _id: auctionId, hostId },
    { status: "LIVE" },
    { new: true }
  );
};

exports.registerForAuction = async (auctionId, userId) => {
  const auction = await Auction.findById(auctionId);

  if (!auction) {
    throw new Error("Auction not found");
  }

  if (auction.status !== "UPCOMING") {
    throw new Error("Registration closed");
  }

  if (auction.registeredUsers.includes(userId)) {
    throw new Error("Already registered");
  }

  auction.registeredUsers.push(userId);
  await auction.save();

  return auction;
};

exports.moveToNextItem = async (auctionId, hostId) => {
  const auction = await Auction.findOne({
    _id: auctionId,
    hostId,
  });

  if (!auction) throw new Error("Auction not found");

  if (auction.currentItemIndex >= auction.items.length - 1) {
    throw new Error("No more items");
  }

  auction.currentItemIndex += 1;
  auction.currentBid = null;
  auction.highestBidder = null;
  auction.bidHistory = [];

  await auction.save();
  return auction;
};
