const { Server } = require("socket.io");
const { getAuction } = require("./liveState");

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
                console.log("➡️ join-auction RECEIVED", {
                    socketId: socket.id,
                    auctionId,
                    role,
                    userId,
                });

                if (!auctionId) {
                    console.error("❌ auctionId missing");
                    return;
                }

                socket.join(`auction:${auctionId}`);
                console.log(`✅ ${role} joined room auction:${auctionId}`);

                const auction = getAuction(auctionId);
                console.log("📦 live auction state:", auction);

                // 🔥 RE-SYNC CURRENT ITEM
                if (auction.currentItem) {
                    console.log("🔁 Re-syncing item for", role);
                    socket.emit("item-live", auction.currentItem);
                } else {
                    console.log("⚠️ No currentItem to sync");
                }

                // 🔥 RE-SYNC HIGHEST BID
                if (auction.highestBid) {
                    console.log("🔁 Re-syncing highest bid for", role);
                    socket.emit("bid-updated", auction.highestBid);
                }

            } catch (err) {
                console.error("🔥 ERROR in join-auction", err);
            }
        });

        // ================= PLACE BID =================
        socket.on("place-bid", ({ auctionId, itemId, amount, userId, userName, userEmail }) => {
            const auction = getAuction(auctionId);

            if (auction.status !== "BIDDING") return;
            if (!auction.currentItem) return;
            if (auction.currentItem._id !== itemId) return;

            if (auction.highestBid && amount <= auction.highestBid.amount) {
                socket.emit("bid-rejected", {
                    message: "Bid must be higher than current bid",
                });
                return;
            }

            const bid = {
                amount,
                userId,
                userName,
                userEmail,
                time: Date.now(),
            };

            auction.highestBid = bid;
            auction.bids.push(bid);

            io.to(`auction:${auctionId}`).emit("bid-updated", bid);

            console.log("NEW BID:", bid);
        });

        // ================= START COUNTDOWN =================
        socket.on("host:start-countdown", ({ auctionId }) => {
            const auction = getAuction(auctionId);

            if (auction.status !== "BIDDING") return;

            auction.status = "COUNTDOWN";

            let count = 3;

            const interval = setInterval(() => {
                io.to(`auction:${auctionId}`).emit("countdown", count);
                count--;

                if (count < 0) {
                    clearInterval(interval);

                    auction.status = "ENDED";

                    io.to(`auction:${auctionId}`).emit("winner-declared", {
                        winner: auction.highestBid,
                        bids: auction.bids,
                        item: auction.currentItem,
                    });

                    console.log("WINNER:", auction.highestBid);
                }
            }, 1000);
        });

        socket.on("host:set-item", ({ auctionId, item }) => {
            console.log("📡 SERVER RECEIVED host:set-item", {
                auctionId,
                itemId: item?._id,
            });

            const auction = getAuction(auctionId);

            auction.currentItem = item;
            auction.highestBid = null;
            auction.bids = [];
            auction.status = "BIDDING";

            console.log("📢 SERVER EMITTING item-live to room", `auction:${auctionId}`);

            io.to(`auction:${auctionId}`).emit("item-live", item);
        });
        
        
        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        });

        
    });

    return io;
}

module.exports = { initSocket };
