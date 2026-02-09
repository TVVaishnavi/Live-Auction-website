import { useEffect, useState } from "react";
import AvailableAuctionItems from "../components/AvailableAuctionItems";
import MyAuctionList from "../components/MyAuctionList";
import { useAuction } from "../hooks/useAuction";
import { useNavigate } from "react-router-dom";
import HostAuctionSummary from '../components/HostAuctionSummary';
import "../styles/HostDashboard.css";

export default function HostDashboard() {
  const { getHostUpcomingAuctions, startAuction, getMyPreviousAuctions, finalizeItem } = useAuction();
  const navigate = useNavigate();

  const [upcoming, setUpcoming] = useState([]);
  const [previous, setPrevious] = useState([]);
  const [expandedAuctionId, setExpandedAuctionId] = useState(null);
  const [previousAuctions, setPreviousAuctions] = useState([]);
  const [openAuctionId, setOpenAuctionId] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [saving, setSaving] = useState(false);


  useEffect(() => {
    fetchHostAuctions();
    fetchPreviousAuctions();
  }, []);

  useEffect(() => {
    const fetchPrevious = async () => {
      try {
        const data = await getMyPreviousAuctions();
        setPreviousAuctions(data); // ⚠️ data is ARRAY
      } catch (err) {
        console.error("Failed to load previous auctions", err);
      }
    };

    fetchPrevious();
  }, []);


  const toggleAuction = (auctionId) => {
    setExpandedAuctionId((prev) =>
      prev === auctionId ? null : auctionId
    );
  };

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

      {/* seller related */}
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
                  // mark auction as LIVE in backend
                  await startAuction(auction._id);

                  // 🔥 go to REAL live auction page
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

            {/* 🔽 clickable header */}
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

            {/* 🔽 dropdown table */}
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
                        {item.isFinalized ? (
                          item.winnerName
                        ) : (
                          <input
                            type="text"
                            placeholder="Winner name"
                            value={drafts[item._id]?.winnerName || ""}
                            onChange={(e) =>
                              setDrafts((prev) => ({
                                ...prev,
                                [item._id]: {
                                  ...prev[item._id],
                                  winnerName: e.target.value,
                                },
                              }))
                            }
                          />

                        )}
                      </td>

                      <td>
                        {item.isFinalized ? (
                          <>
                            {item.winnerEmail}
                          </>
                        ) : (
                          <input
                            type="email"
                            placeholder="Winner email"
                            value={drafts[item._id]?.winnerEmail || ""}
                            onChange={(e) =>
                              setDrafts((prev) => ({
                                ...prev,
                                [item._id]: {
                                  ...prev[item._id],
                                  winnerEmail: e.target.value,
                                },
                              }))
                            }
                          />
                        )}
                      </td>

                      <td>
                        {item.isFinalized ? (
                          `₹${item.finalPrice}`
                        ) : (
                          <input
                            type="number"
                            placeholder="Final price"
                            value={drafts[item._id]?.finalPrice || ""}
                            onChange={(e) =>
                              setDrafts((prev) => ({
                                ...prev,
                                [item._id]: {
                                  ...prev[item._id],
                                  finalPrice: e.target.value,
                                },
                              }))
                            }
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {auction.items.some((i) => !i.isFinalized) && (
              <button
                disabled={saving}
                onClick={async () => {
                  setSaving(true);

                  for (const itemId in drafts) {
                    const { winnerName, finalPrice, winnerEmail } = drafts[itemId];
                    if (!winnerName || !finalPrice || !winnerEmail) continue;

                    await finalizeItem(itemId, {
                      winnerName,
                      winnerEmail,
                      finalPrice,
                    });
                  }

                  window.location.reload();
                }}
              >
                Save
              </button>
            )}

          </div>
        ))
      )}
    </div>
  );
}
