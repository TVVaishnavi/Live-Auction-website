import { useEffect, useState } from "react";
import AvailableAuctionItems from "../components/AvailableAuctionItems";
import MyAuctionList from "../components/MyAuctionList";
import { useAuction } from "../hooks/useAuction";
import { useNavigate } from "react-router-dom";
import "../styles/HostDashboard.css";

export default function HostDashboard() {
  const { getHostUpcomingAuctions, startAuction } = useAuction();
  const navigate = useNavigate();

  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    fetchHostAuctions();
  }, []);

  const fetchHostAuctions = async () => {
    try {
      const upcomingAuctions = await getHostUpcomingAuctions();
      setUpcoming(upcomingAuctions);
    } catch (err) {
      console.error("Failed to load host auctions", err);
    }
  };

  const canStartAuction = (startTime, status) => {
    if (status !== "UPCOMING") return false;

    const now = new Date();
    const start = new Date(startTime);
    const diffMinutes = (start - now) / (1000 * 60);

    return diffMinutes <= 20 && diffMinutes >= 0;
  };

  return (
    <div className="host-page">
      <header className="host-header">
        <h1>Host Dashboard</h1>
        <p>Manage auction items and schedule events</p>
      </header>

      <AvailableAuctionItems />
      <MyAuctionList />

      <h2>Upcoming Auctions</h2>

      {upcoming.length === 0 ? (
        <p>No upcoming auctions</p>
      ) : (
        upcoming.map((auction) => {
          const canStart = canStartAuction(
            auction.startTime,
            auction.status
          );

          return (
            <div className="host-card" key={auction._id}>
              <h3>{auction.title}</h3>

              <p>
                Starts at{" "}
                {new Date(auction.startTime).toLocaleString()}
              </p>

              <button
                disabled={!canStart}
                onClick={async () => {
                  await startAuction(auction._id);
                  navigate(`/hostlive/${auction._id}`);
                }}
              >
                {canStart
                  ? "Start Auction"
                  : "Enabled 20 mins before"}
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}
