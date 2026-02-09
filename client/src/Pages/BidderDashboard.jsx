import { useEffect, useState } from "react";
import { useAuction } from "../hooks/useAuction";
import RegisteredAuctions from "../components/RegisteredAuctions";
import "../styles/BidderDashboard.css";

function BidderDashboard() {
  const { getMyRegistrations, getMyWins } = useAuction();

  const [registrations, setRegistrations] = useState([]);
  const [wins, setWins] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const now = new Date();

  const visibleRegistrations = registrations.filter((auction) => {
    if (!auction.startTime) return true; 

    const startTime = new Date(auction.startTime);
    const hideAfter = new Date(startTime.getTime() + 60 * 60 * 1000); 

    return now < hideAfter;
  });

  const fetchData = async () => {
    try {
      const regs = await getMyRegistrations();
      console.log("REGISTRATIONS FROM API:", regs);
      setRegistrations(regs);

      try {
        const winsData = await getMyWins();
        setWins(winsData);
      } catch (e) {
        console.warn("Wins not available yet");
      }
    } catch (err) {
      console.error("Failed to load registrations", err);
    }
  };

  const totalSpent = wins.reduce(
    (sum, w) => sum + (w.finalPrice || 0),
    0
  );

  return (
    <div className="bidder-page">
      <h1 className="bidder-title">Bidder Dashboard</h1>
      <p className="bidder-subtitle">
        Manage your auction registrations and winnings
      </p>

      <div className="bidder-stats">
        <StatCard
          label="REGISTERED AUCTIONS"
          value={visibleRegistrations.length}
        />

        <StatCard label="ITEMS WON" value={wins.length} />
        <StatCard
          label="TOTAL SPENT"
          value={`₹${totalSpent.toLocaleString()}`}
        />
      </div>

      <RegisteredAuctions auctions={visibleRegistrations} />
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <p>{label}</p>
      <h2>{value}</h2>
    </div>
  );
}

export default BidderDashboard;
