const Auction = require("../models/auction");
const AuctionItem = require("../models/auctionItem");
const Bid = require("../models/bid");

/* =========================
   REGISTER FOR AUCTION
   ========================= */
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

/* =========================
   CHECK REGISTRATION
   ========================= */
exports.isRegistered = async (auctionId, userId) => {
  const auction = await Auction.findById(auctionId);
  if (!auction) return false;

  return auction.registeredUsers.includes(userId);
};

/* =========================
   PLACE BID
   ========================= */
exports.placeBid = async (itemId, userId, amount) => {
  return Bid.create({
    auctionItemId: itemId,
    bidderId: userId,
    amount,
  });
};

/* =========================
   MY REGISTRATIONS
   ========================= */
exports.myRegistrations = async (userId) => {
  return Auction.find({
    registeredUsers: userId,
  })
    .populate("items")
    .sort({ startTime: 1 });
};
