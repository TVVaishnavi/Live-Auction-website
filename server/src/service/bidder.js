const Auction = require("../models/auction");
const AuctionItem = require("../models/auctionItem");

exports.registerAuction = async (auctionId, userId) => {
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

  return { registered: true };
};

exports.isRegistered = async (auctionId, userId) => {
  const auction = await Auction.findById(auctionId);
  if (!auction) return false;

  return auction.registeredUsers.includes(userId);
};

exports.myRegistrations = async (userId) => {
  return Auction.find({
    registeredUsers: userId,
  })
    .populate("items")
    .sort({ startTime: 1 });
};
