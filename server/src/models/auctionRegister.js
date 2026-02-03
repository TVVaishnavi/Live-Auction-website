const mongoose = require("mongoose");

const auctionRegistrationSchema = new mongoose.Schema(
  {
    auctionKey: {
      type: String,
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

auctionRegistrationSchema.index(
  { auctionKey: 1, userId: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "AuctionRegistration",
  auctionRegistrationSchema
);
