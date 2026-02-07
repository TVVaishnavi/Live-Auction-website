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

      // persist backend
      await completeAuctionItem(soldItemId, {
        winner: data.winner,
        bids: data.bids,
      });

      // ⏱️ delay for UX (winner visibility)
      setTimeout(() => {
        setCompletedItemIds((prev) => [...prev, soldItemId]);
        setActiveItem(null);
        setHighestBid(null);
        setBids([]);
        setCountdown(null);

        // 🔥 CHECK IF THIS WAS THE LAST ITEM
        const soldCount = completedItemIds.length + 1;
        if (soldCount === items.length) {
          socket.emit("auction-ended", { auctionId });
        }
      }, 60_000); // 1 minute
    };

    socket.on("winner-declared", onWinnerDeclared);
    return () => socket.off("winner-declared", onWinnerDeclared);
  }, [activeItem, completedItemIds, items]);

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

      console.log("Auction items response:", data);

      setItems(data.items || data.auctionItems || []);
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
      <h1>HOST LIVE</h1>

      {activeItem ? (
        <div className="active-item">
          <h2>{activeItem.title}</h2>

          <p className="desc">{activeItem.description}</p>

          <img src={activeItem.images?.[0]} alt={activeItem.title} />

          <p className="price">Starting Price: ₹{activeItem.startingPrice}</p>
        </div>
      ) : (
        <p>Select an item</p>
      )}

      <button
        onClick={() => socket.emit("host:start-countdown", { auctionId })}
      >
        Start Countdown
      </button>

      {countdown !== null && <h1>{countdown}</h1>}

      {winner && (
        <h2>
          Winner: {winner.userName} ({winner.userEmail}) – ₹{winner.amount}
        </h2>
      )}

      <h3>Items</h3>
      <h3>Items</h3>
      {items.map((item) => {
        const isSold = completedItemIds.includes(item._id);

        return (
          <div
            key={item._id}
            onClick={() => {
              if (!isSold) startItem(item);
            }}
            style={{
              cursor: isSold ? "not-allowed" : "pointer",
              opacity: isSold ? 0.45 : 1,
              textDecoration: isSold ? "line-through" : "none",
              pointerEvents: isSold ? "none" : "auto",
              padding: "6px 0",
              color: isSold ? "#888" : "#fff",
              fontStyle: isSold ? "italic" : "normal",
            }}
          >
            {item.title}
            {isSold && (
              <span
                style={{ marginLeft: 8, color: "#ff6b6b", fontWeight: 600 }}
              >
                (SOLD)
              </span>
            )}
          </div>
        );
      })}

      {highestBid && (
        <div className="highest-bid">
          <h3>Current Highest Bid</h3>
          <p>
            ₹{highestBid.amount}
            <br />
            {highestBid.userName} ({highestBid.userEmail})
          </p>
        </div>
      )}

      <h3>Live Bids</h3>

      {bids.length === 0 ? (
        <p>No bids yet</p>
      ) : (
        <div className="bid-list">
          {bids.map((bid, index) => (
            <div key={index} className="bid-row">
              <span>{bid.userName}</span>
              <span>{bid.userEmail}</span>
              <strong>₹{bid.amount}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
