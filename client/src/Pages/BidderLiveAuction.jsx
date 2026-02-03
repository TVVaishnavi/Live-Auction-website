import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuction } from "../hooks/useAuction";
import "../styles/BidderLiveAuction.css";

export default function BidderLiveAuction() {
  const [activeItem, setActiveItem] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const { auctionKey } = useParams();
  const { getLiveAuctionState} = useAuction();

  useEffect(() => {
    const loadLiveAuction = async () => {
      const data = await getLiveAuctionState(auctionKey);
      setActiveItem(data.activeItem);
      setBids(data.bids);
    };

    loadLiveAuction();

    const interval = setInterval(loadLiveAuction, 2000);
    return () => clearInterval(interval);
  }, [auctionKey]);


  const placeBid = () => {
    if (!bidAmount) return;

    setBids((prev) => [
      {
        bidderName: "You",
        amount: bidAmount,
        createdAt: new Date(),
      },
      ...prev,
    ]);

    setBidAmount("");
  };

  return (
    <div className="live-container">
      {/* HEADER */}
      <header className="live-header">
        <div>
          <h1>LIVE AUCTION</h1>
          <p>Spring Art Collection - February 15, 2026</p>
        </div>

        <div className="view-toggle">
          <button>HOST VIEW</button>
          <button className="active">BIDDER VIEW</button>
          <span className="live-dot">● LIVE</span>
        </div>
      </header>

      {/* MAIN PANEL */}
      <section className="main-panel">
        {!activeItem ? (
          <div className="empty-state">
            <div className="clock-icon">⏱</div>
            <h2>Waiting for Auction to Start</h2>
            <p>The host will begin the auction shortly</p>
          </div>
        ) : (
          <div className="active-item">
            <h2>{activeItem.title}</h2>

            <img src={activeItem.images[0]} alt="" />

            <p className="desc">{activeItem.description}</p>

            <p className="price">
              Current Bid: ₹{activeItem.currentBid}
            </p>

            <div className="bid-box">
              <input
                type="number"
                placeholder="Enter your bid"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
              />
              <button onClick={placeBid}>Place Bid</button>
            </div>
          </div>
        )}
      </section>

      {/* BID HISTORY */}
      <section className="bid-history">
        <h3>Bid History</h3>

        {bids.length === 0 ? (
          <div className="no-bids">
            <p>No bids yet</p>
            <span>Be the first to bid!</span>
          </div>
        ) : (
          bids.map((bid, i) => (
            <div key={i} className="bid-row">
              <span>{bid.bidderName}</span>
              <span>₹{bid.amount}</span>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
