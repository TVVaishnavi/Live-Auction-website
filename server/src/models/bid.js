const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema(
  {
    auctionItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuctionItem",
      required: true,
    },
    bidderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

bidSchema.index({ auctionItemId: 1, amount: -1 });

module.exports = mongoose.model("Bid", bidSchema);