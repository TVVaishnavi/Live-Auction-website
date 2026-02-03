import { useEffect, useState } from "react";
import AvailableAuctionItems from "../components/AvailableAuctionItems";
import MyAuctionList from "../components/MyAuctionList";
import RegisteredParticipants from "../components/RegistersParticipants";
import { useAuction } from "../hooks/useAuction";
import { useNavigate } from "react-router-dom";
import "../styles/HostDashboard.css";

export default function HostDashboard() {
    const {
        getHostUpcomingAuctions,
        getHostPreviousAuctions,
        startAuction,
    } = useAuction();
    const navigate = useNavigate()
    const [hostedAuctions, setHostedAuctions] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [previous, setPrevious] = useState([]);

    useEffect(() => {
        fetchHostAuctions();
    }, []);

    const fetchHostAuctions = async () => {
        try {
            const upcomingData = await getHostUpcomingAuctions();
            setUpcoming(upcomingData);

            const previousData = await getHostPreviousAuctions();
            setPrevious(previousData);
        } catch (err) {
            console.error("Failed to load host auctions", err);
        }
    };

    const canStartAuction = (startTime) => {
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

            {hostedAuctions.map((auction) => (
                <RegisteredParticipants
                    key={auction._id}
                    auction={auction}
                />
            ))}

            <h2>Upcoming Auctions</h2>

            {upcoming.length === 0 ? (
                <p>No upcoming auctions</p>
            ) : (
                upcoming.map((auction) => {
                    const auctionKey = `${auction.liveTitle}-${auction.startTime}`;
                    const canStart = canStartAuction(auction.startTime);

                    return (
                        <div className="host-card" key={auctionKey}>
                            <h3>{auction.liveTitle}</h3>
                            <p>
                                Starts at{" "}
                                {new Date(auction.startTime).toLocaleString()}
                            </p>

                            <button
                                disabled={!canStart}
                                onClick={async () => {
                                    await startAuction(auctionKey); 
                                    navigate(`/hostlive/:auctionkey`); navigate(`/hostlive/${encodeURIComponent(auctionKey)}`);
                                }}
                            >
                                {canStart ? "Start Auction" : "Enabled 20 mins before"}
                            </button>

                        </div>
                    );
                })
            )}

            <h2>Previous Auctions</h2>

            {previous.length === 0 ? (
                <p>No previous auctions</p>
            ) : (
                <table className="host-table">
                    <thead>
                        <tr>
                            <th>Auction</th>
                            <th>Winner</th>
                            <th>Final Price</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {previous.map((a) => (
                            <tr key={a._id}>
                                <td>{a.liveTitle}</td>
                                <td>{a.winnerName || "—"}</td>
                                <td>₹{a.finalPrice || "—"}</td>
                                <td>
                                    {new Date(a.updatedAt).toDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
