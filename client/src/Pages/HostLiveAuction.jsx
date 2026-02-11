import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";
import { useAuction } from "../hooks/useAuction";
import { useNavigate } from "react-router-dom";
import "../styles/HostLiveAuction.css";

export default function HostLiveAuction() {
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const { getAuctionById, completeAuctionItem } = useAuction();

  const [items, setItems] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [winner, setWinner] = useState(null);
  const [bids, setBids] = useState([]);
  const [highestBid, setHighestBid] = useState(null);
  const [completedItemIds, setCompletedItemIds] = useState([]);
  const [itemEnded, setItemEnded] = useState(false);

  useEffect(() => {
    const onAuctionEnded = () => {
      navigate("/host/dashboard");
    };

    socket.on("auction-ended", onAuctionEnded);
    return () => socket.off("auction-ended", onAuctionEnded);
  }, []);

  useEffect(() => {
    socket.on("bid-updated", (bid) => {
      setBids((prev) => [bid, ...prev]);
      setHighestBid(bid);
    });

    return () => {
      socket.off("bid-updated");
    };
  }, []);

  useEffect(() => {
    const onWinnerDeclared = async (data) => {
      if (!activeItem) return;

      const soldItemId = activeItem._id;

      setWinner(data.winner);

      const refreshed = await getAuctionById(auctionId);
      setItems(refreshed.items || refreshed.auctionItems || []);

      setTimeout(() => {
        setActiveItem(null);
        setHighestBid(null);
        setBids([]);
        setCountdown(null);
        setWinner(null);
      }, 3000); // shorter delay for testing
    };

    socket.on("winner-declared", onWinnerDeclared);
    return () => socket.off("winner-declared", onWinnerDeclared);
  }, [activeItem]);


  useEffect(() => {
    socket.emit("join-auction", {
      auctionId,
      role: "HOST",
    });

    socket.on("countdown", setCountdown);

    return () => {
      socket.off("countdown");
      socket.off("winner-declared");
    };
  }, []);

  useEffect(() => {
    const loadAuction = async () => {
      const data = await getAuctionById(auctionId);

      const auctionItems = data.items || data.auctionItems || [];

      setItems(auctionItems);

      const soldItems = auctionItems
        .filter(item => item.status === "COMPLETED" || item.isFinalized)
        .map(item => item._id);

      setCompletedItemIds(soldItems);
    };

    loadAuction();
  }, [auctionId]);


  useEffect(() => {
    socket.on("host:next-item", () => {
      const index = items.findIndex((i) => i._id === activeItem._id);
      const next = items[index + 1];

      if (next) startItem(next);
      else alert("Auction completed");
    });

    return () => socket.off("host:next-item");
  }, [items, activeItem]);

  const startItem = (item) => {
    console.log("HOST STARTING ITEM", {
      auctionId,
      itemId: item._id,
      title: item.title,
    });

    setActiveItem(item);
    setCountdown(null);
    setWinner(null);

    socket.emit("host:set-item", {
      auctionId,
      item,
    });
  };

  return (
    <div className="live-container">
      <h1 className="page-title">Host Live Auction</h1>
      <div className="live-indicator">
        <span className="live-dot"></span>
        <span className="live-text">LIVE</span>
      </div>

      <div className="top-section">
        {activeItem ? (
          <div className="active-item-card">
            <img
              src={activeItem.images?.[0]}
              alt={activeItem.title}
              className="item-image"
            />

            <div className="item-details">
              <h2>{activeItem.title}</h2>
              <p className="desc">{activeItem.description}</p>
              <p className="price">
                Starting Price: ₹{activeItem.startingPrice}
              </p>

              <button
                className="countdown-btn"
                disabled={itemEnded}
                onClick={() =>
                  socket.emit("host:start-countdown", { auctionId })
                }
              >
                Start Countdown
              </button>

              {countdown !== null && (
                <div className="countdown">{countdown}</div>
              )}

              {winner && (
                <div className="winner-box">
                  Winner: <strong>{winner.userName}</strong> (
                  {winner.userEmail}) – ₹{winner.amount}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="empty-state">Select an item to start bidding</div>
        )}
      </div>

      <div className="bottom-section">
        <div className="items-panel">
          <h3>Items</h3>
          {items.map((item) => {
            const isSold = !!item.finalPrice;
            return (
              <div
                key={item._id}
                className={`item-row ${isSold ? "sold" : ""}`}
                onClick={() => !isSold && startItem(item)}
              >
                {item.title}
                {isSold && <span className="sold-tag">SOLD</span>}
              </div>
            );
          })}
        </div>

        <div className="bids-panel">
          <h3>Live Bids</h3>

          {highestBid && (
            <div className="highest-bid">
              <p>Highest Bid</p>
              <strong>₹{highestBid.amount}</strong>
              <span>
                {highestBid.userName} ({highestBid.userEmail})
              </span>
            </div>
          )}

          {bids.length === 0 ? (
            <p className="muted">No bids yet</p>
          ) : (
            <div className="bid-list">
              {bids.map((bid, index) => (
                <div key={index} className="bid-row">
                  <span>{bid.userName}</span>
                  <small>{bid.userEmail}</small>
                  <strong>₹{bid.amount}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <button
        className="end-auction-btn"
        onClick={() => socket.emit("auction-ended", { auctionId })}
      >
        End Auction
      </button>
    </div>
  );
}
