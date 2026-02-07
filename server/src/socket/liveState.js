const liveAuctions = new Map();

function getAuction(auctionId) {
  if (!liveAuctions.has(auctionId)) {
    liveAuctions.set(auctionId, {
      currentItem: null,
      highestBid: null,
      bids: [],
      status: "IDLE",
    });
  }
  return liveAuctions.get(auctionId);
}


module.exports = { getAuction };
