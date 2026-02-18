const Auction = require("../models/auction");
const AuctionItem = require("../models/auctionItem");

exports.registerAuction = async (auctionId, userId, role) => {
  const auction = await Auction.findById(auctionId);
  if(role !== "BIDDER"){
    throw new Error("Only bidders can register for auctions");
  }
  
  if (!auction) {
    throw new Error("Auction not found");
  }

  if (auction.status !== "UPCOMING") {
    throw new Error("Registration closed");
  }

  if (auction.registeredUsers.includes(userId)) {
    return { registered: true };
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
