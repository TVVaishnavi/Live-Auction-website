const { Server } = require("socket.io");
const { getAuction } = require("./liveState");
const Auction = require("../models/auction");
const bidQueues = new Map();
const processingItems = new Set();
const highestBidMap = new Map();
const countdownTimers = new Map();

let io;

function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        socket.on("join-auction", ({ auctionId, role, userId }) => {
            try {
                console.log("join-auction RECEIVED", {
                    socketId: socket.id,
                    auctionId,
                    role,
                    userId,
                });

                if (!auctionId) {
                    console.error("auctionId missing");
                    return;
                }

                socket.join(`auction:${auctionId}`);
                console.log(`${role} joined room auction:${auctionId}`);

                const auction = getAuction(auctionId);
                console.log("live auction state:", auction);

                if (auction.currentItem) {
                    console.log("Re-syncing item for", role);
                    socket.emit("item-live", auction.currentItem);
                } else {
                    console.log("No currentItem to sync");
                }

                if (auction.highestBid) {
                    console.log("Re-syncing highest bid for", role);
                    socket.emit("bid-updated", auction.highestBid);
                }

            } catch (err) {
                console.error("ERROR in join-auction", err);
            }
        });

        socket.on(
            "place-bid",
            ({ auctionId, itemId, amount, userId, userName, userEmail }) => {
                const auction = getAuction(auctionId);

               if (!["BIDDING", "COUNTDOWN"].includes(auction.status)) return;
                if (!auction.currentItem) return;
                if (auction.currentItem._id !== itemId) return;

                if (!bidQueues.has(itemId)) {
                    bidQueues.set(itemId, []);
                }

                bidQueues.get(itemId).push({
                    auctionId, 
                    itemId,
                    amount,
                    userId,  
                    userName,
                    userEmail,
                    socketId: socket.id,
                    time: Date.now(),
                });

                processBidQueue(itemId);
            }
        );

        async function processBidQueue(itemId) {
            if (processingItems.has(itemId)) return;

            processingItems.add(itemId);

            const queue = bidQueues.get(itemId);

            while (queue && queue.length > 0) {
                const bid = queue.shift();

                const auction = getAuction(bid.auctionId);

                if (!auction || !["BIDDING", "COUNTDOWN"].includes(auction.status)) continue;
                if (!auction.currentItem) continue;

                if (auction.status === "COUNTDOWN") {
                    const timer = countdownTimers.get(bid.auctionId);
                    if (timer) {
                        clearInterval(timer);
                        countdownTimers.delete(bid.auctionId);
                    }

                    auction.status = "BIDDING";

                    io.to(`auction:${bid.auctionId}`).emit("countdown-cancelled");
                }

                const currentHighest = auction.highestBid?.amount || 0;

                if (bid.amount <= currentHighest) {
                    io.to(bid.socketId).emit("bid-rejected", {
                        message: "Bid must be higher than current bid",
                    });
                    continue;
                }

                const acceptedBid = {
                    amount: bid.amount,
                    userId: bid.userId,
                    userName: bid.userName,
                    userEmail: bid.userEmail,
                    time: bid.time,
                };

                auction.highestBid = acceptedBid;
                auction.bids.push(acceptedBid);

                io.to(`auction:${bid.auctionId}`).emit("bid-updated", acceptedBid);

                console.log("NEW BID (QUEUED):", acceptedBid);
            }

            processingItems.delete(itemId);
        }

        socket.on("host:start-countdown", ({ auctionId }) => {
            const auction = getAuction(auctionId);
            if (auction.status === "ENDED") return;

            auction.status = "COUNTDOWN";
            let count = 3;

            const interval = setInterval(() => {
                io.to(`auction:${auctionId}`).emit("countdown", count);
                count--;

                if (count <= 0) {
                    clearInterval(interval);
                    countdownTimers.delete(auctionId);

                    auction.status = "COMPLETED";

                    io.to(`auction:${auctionId}`).emit("winner-declared", {
                        winner: auction.highestBid,
                        bids: auction.bids,
                        item: auction.currentItem,
                    });
                }
            }, 1000);

            countdownTimers.set(auctionId, interval);
        });

        socket.on("host:set-item", ({ auctionId, item }) => {
            console.log(" SERVER RECEIVED host:set-item", {
                auctionId,
                itemId: item?._id,
            });

            const auction = getAuction(auctionId);

            auction.currentItem = item;
            auction.highestBid = null;
            auction.bids = [];
            auction.status = "BIDDING";

            console.log(" SERVER EMITTING item-live to room", `auction:${auctionId}`);

            io.to(`auction:${auctionId}`).emit("item-live", item);
        });

        socket.on("auction-ended", async ({ auctionId }) => {
            try {
                await Auction.findByIdAndUpdate(auctionId, {
                    status: "COMPLETED",
                });

                io.to(`auction:${auctionId}`).emit("auction-ended");
            } catch (err) {
                console.error("Failed to end auction:", err);
            }
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        });


    });

    return io;
}

module.exports = { initSocket };
