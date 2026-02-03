const mongoose = require("mongoose");

const auctionItemSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        startingPrice: Number,

        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        images: {
            type: [String],
            validate: {
                validator: arr => arr.length >= 1 && arr.length <= 5,
                message: "1–5 images required",
            },
        },


        liveTitle: String,
        liveDescription: String,

        hostId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        hostEmail: {
            type: String,
            default: null,
            lowercase: true,
            trim: true,
        },

        status: {
            type: String,
            enum: ["AVAILABLE", "CLAIMED", "SCHEDULED", "LIVE", "CLOSED"],
            default: "AVAILABLE",
        },

        winnerName: {
            type: String,
            default: null,
        },

        finalPrice: {
            type: Number,
            default: null,
        },

        startTime: Date,
        meetLink: String,

        published: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("AuctionItem", auctionItemSchema);
