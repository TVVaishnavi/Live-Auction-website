const AuctionItem = require("../models/auctionItem");
const Item = require("../models/auction");

exports.getAvailableItems = async () => {
  return AuctionItem.find({ status: { $in: ["AVAILABLE", "UNSOLD"] } })
    .populate("sellerId", "name email");
};

exports.claimItem = async (itemId, hostId) => {
  return AuctionItem.findOneAndUpdate(
    { _id: itemId, status: { $in: ["AVAILABLE", "UNSOLD"] } },
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

exports.finalizeItem = async ({
  itemId,
  winnerName,
  winnerEmail,
  finalPrice,
}) => {
  const item = await AuctionItem.findById(itemId);

  if (!item) throw new Error("Item not found");
  if (item.isFinalized) throw new Error("Item already finalized");

  item.winnerName = winnerName;
  item.winnerEmail = winnerEmail;
  item.finalPrice = finalPrice;
  item.status = "COMPLETED";
  item.isFinalized = true;

  await item.save();
  return item;
}; 

exports.closeAuctionItems = async (auctionId) => {
  const item = await AuctionItem.find({
    auctionId, 
    status: {$in: ["COMPLETED"]}
  })

  for (const i of item){
    if(!i.isFinalized){
      i.status = "UNSOLD";

      i.winnerName = null;
      i.winnerEmail = null;
      i.finalPrice = null;
      i.isFinalized = true;

      i.hostId = null;
      i.auctionId = null;
 
    }
    await i.save();
  }

  return true;
}