import { useEffect, useState } from "react";
import AvailableAuctionItems from "../components/AvailableAuctionItems";
import MyAuctionList from "../components/MyAuctionList";
import { useAuction } from "../hooks/useAuction";
import { useNavigate } from "react-router-dom";
import "../styles/HostDashboard.css";

export default function HostDashboard() {
  const { getHostUpcomingAuctions, startAuction, getMyPreviousAuctions, finalizeItem } = useAuction();
  const navigate = useNavigate();

  const [upcoming, setUpcoming] = useState([]);
  const [previous, setPrevious] = useState([]);
  const [previousAuctions, setPreviousAuctions] = useState([]);
  const [openAuctionId, setOpenAuctionId] = useState(null);


  useEffect(() => {
    fetchHostAuctions();
    fetchPreviousAuctions();
  }, []);

  useEffect(() => {
    const fetchPrevious = async () => {
      try {
        const data = await getMyPreviousAuctions();
        setPreviousAuctions(data);
      } catch (err) {
        console.error("Failed to load previous auctions", err);
      }
    };

    fetchPrevious();
  }, []);


  const fetchPreviousAuctions = async () => {
    try {
      const data = await getMyPreviousAuctions();
      setPrevious(data)
    } catch (error) {
      console.error("failed to load previous auction: ", error);
    }
  }

  const fetchHostAuctions = async () => {
    try {
      const data = await getHostUpcomingAuctions();
      setUpcoming(data);
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
                  navigate(`/host/live/${auction._id}`);

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

      <h2>Previous Auctions</h2>

      {previousAuctions.length === 0 ? (
        <p>No previous auctions</p>
      ) : (
        previousAuctions.map((auction) => (
          <div key={auction._id} className="host-card">

            <div
              style={{ cursor: "pointer" }}
              onClick={() =>
                setOpenAuctionId(
                  openAuctionId === auction._id ? null : auction._id
                )
              }
            >
              <h3>{auction.title}</h3>
              <p>Status: {auction.status}</p>
            </div>

            {/* Expand Table */}
            {openAuctionId === auction._id && (
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Seller</th>
                    <th>Winner</th>
                    <th>Final Price</th>
                  </tr>
                </thead>
                <tbody>
                  {auction.items.map((item) => (
                    <tr key={item._id}>
                      <td>{item.title}</td>

                      <td>
                        {item.sellerId?.name}
                        <br />
                        <small>{item.sellerId?.email}</small>
                      </td>

                      <td>
                        {item.winnerName ? (
                          <>
                            <strong>{item.winnerName}</strong>
                            <br />
                            <small>{item.winnerEmail}</small>
                          </>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td>
                        {item.finalPrice ? `₹${item.finalPrice}` : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))
      )}

    </div>
  );
}
