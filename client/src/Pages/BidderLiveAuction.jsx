import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "../styles/BidderLiveAuction.css";

export default function BidderLiveAuction() {

  const { auctionId } = useParams();
  const [activeItem, setActiveItem] = useState(null);
  const [bids, setBids] = useState([]);
  const [amount, setAmount] = useState("");
  const [countdown, setCountdown] = useState(null);
  const [winner, setWinner] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);

  const { getMe } = useAuth();

  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const onAuctionEnded = () => {
      navigate("/bidder/dashboard");
    };

    socket.on("auction-ended", onAuctionEnded);
    return () => socket.off("auction-ended", onAuctionEnded);
  }, []);

  useEffect(() => {
    getMe()
      .then(res => setUser(res.user))
      .catch(() => setUser(null))
      .finally(() => setAuthChecked(true));
  }, []);

  useEffect(() => {
    if (!auctionId) return;

    const onItemLive = (item) => {
      setActiveItem(item);
      setBids([]);
      setWinner(null);
      setCountdown(null);
    };

    const onBidUpdated = (bid) => {
      setBids((prev) => [bid, ...prev]);
    };

    const onCountdown = (num) => {
      setCountdown(num);
    };

    const onWinner = (data) => {
      setWinner(data.winner);
      setCountdown(null);
    };

    socket.on("item-live", onItemLive);
    socket.on("bid-updated", onBidUpdated);
    socket.on("countdown", onCountdown);
    socket.on("winner-declared", onWinner);

    const joinAuction = () => {
      console.log("🟢 BIDDER joining auction:", auctionId);

      socket.emit("join-auction", {
        auctionId,
        role: "BIDDER",
        userId: "ANON",
      });
    };

    if (!socket.connected) {
      socket.connect();
      socket.on("connect", joinAuction);
    } else {
      joinAuction();
    }

    return () => {
      socket.off("item-live", onItemLive);
      socket.off("bid-updated", onBidUpdated);
      socket.off("countdown", onCountdown);
      socket.off("winner-declared", onWinner);
      socket.off("connect", joinAuction);
    };
  }, [auctionId]);




  const placeBid = () => {
    if (!amount || !activeItem || countdown !== null || winner) return;

    socket.emit("place-bid", {
      auctionId,
      itemId: activeItem._id,
      amount: Number(amount),
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
    });

    setAmount("");
  };

  return (
    <div className="live-container">
      <header className="live-header">
        <h1>BIDDER LIVE</h1>
        <div className="live-indicator">
          <span className="live-dot"></span>
          <span className="live-text">LIVE</span>
        </div>

      </header>

      {!activeItem ? (
        <div className="empty-state">
          <h2>Waiting for host…</h2>
          <p>The auction will start shortly</p>
        </div>
      ) : (
        <div className="active-item-card">
          <div className="image-wrapper">
            <img
              src={activeItem.images?.[0]}
              alt={activeItem.title}
              className="item-image"
              onClick={() => setZoomImage(activeItem.images?.[0])}
            />
          </div>

          <div className="item-details">
            <h2 className="item-title">{activeItem.title}</h2>
            <p className="desc">{activeItem.description}</p>
            <p className="price">
              Starting Price: ₹{activeItem.startingPrice}
            </p>
          </div>
        </div>

      )}

      {countdown !== null && (
        <div className="countdown">{countdown}</div>
      )}

      {winner && (
        <div className="winner-box">
          <h3>🏆 Winner</h3>
          <p><strong>{winner.userName}</strong></p>
          <p>{winner.userEmail}</p>
          <strong>₹{winner.amount}</strong>
        </div>
      )}

      <div className="bid-box">
        <input
          type="number"
          value={amount}
          placeholder="Place your bid"
          onChange={(e) => setAmount(e.target.value)}
          disabled={countdown !== null || winner}
        />
        <button
          onClick={placeBid}
          disabled={countdown !== null || winner}
        >
          Place Bid
        </button>
      </div>

      <section className="bid-history">
        <h3>Live Bids</h3>
        {bids.length === 0 ? (
          <p>No bids yet</p>
        ) : (
          bids.map((b, i) => (
            <div key={i} className="bid-row">
              <span>{b.userName}</span>
              <span>{b.userEmail}</span>
              <strong>₹{b.amount}</strong>
            </div>
          ))
        )}
      </section>

      {zoomImage && (
        <div className="image-overlay" onClick={() => setZoomImage(null)}>
          <img src={zoomImage} alt="Zoomed item" />
          <span className="close-hint">Click anywhere to close</span>
        </div>
      )}

    </div>
  );
}
