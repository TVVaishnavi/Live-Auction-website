import "../styles/RegisteredAuctions.css";
import { useNavigate } from "react-router-dom";

function RegisteredAuctions({ auctions }) {
  const navigate = useNavigate();

  const canJoinAuction = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diffMinutes = (start - now) / (1000 * 60);
    return diffMinutes <= 20 && diffMinutes > -30;
  };

  return (
    <div className="registered-section">
      <h2>Registered Auctions</h2>

      {auctions.length === 0 && (
        <p className="empty">No registered auctions</p>
      )}

      {auctions.map((auction) => {
        const canJoin = canJoinAuction(auction.startTime);

        return (
          <div key={auction._id} className="auction-card">
            <h3>{auction.title}</h3>
            <p className="desc">{auction.description}</p>

            <p style={{ color: "green", fontWeight: 500, marginTop: "8px" }}>
              You have been registered for this auction
            </p>

            <div className="meta">
              <span>📅 {new Date(auction.startTime).toDateString()}</span>
              <span>⏰ {new Date(auction.startTime).toLocaleTimeString()}</span>
            </div>

            {auction.meetLink && (
              <div className="meet">
                <p className="label">MEETING LINK</p>
                <a href={auction.meetLink} target="_blank" rel="noreferrer">
                  Join Google Meet
                </a>
              </div>
            )}

            {canJoin ? (
              <button
                className="outline-btn"
                onClick={() =>
                  navigate(`/bidder/live/${auction._id}`)
                }
              >
                Join Auction
              </button>
            ) : (
              <p className="disabled-text">
                Join will be enabled 20 minutes before start time
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default RegisteredAuctions;
