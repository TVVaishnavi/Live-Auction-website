import { useEffect, useState } from "react";
import { useAuction } from "../hooks/useAuction";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import '../styles/home.css';

function Home() {
    const { getUpcomingAuctions, registerForAuction } = useAuction();
    const [auctions, setAuctions] = useState([]);
    const [selectedAuction, setSelectedAuction] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [user, setUser] = useState(null);
    const { getMe } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        fetchAuctions();
    }, []);

    const fetchAuctions = async () => {
        const auctions = await getUpcomingAuctions();

        const now = new Date();
        const upcoming = auctions
            .filter(a => new Date(a.startTime) > now)
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

        setAuctions(upcoming);
    };

    const openAuction = (auction) => {
        setIsRegistered(false);
        setSelectedAuction(auction);
    };

    const handleRegister = async () => {
        try {
            await registerForAuction(selectedAuction._id);
            setIsRegistered(true);
            alert("Registered successfully!");
        } catch (err) {
            console.error("Register failed:", err);
            alert("You have already registered, please check in your dashboard.");
        }
    };

    const canJoinAuction = () => {
        const now = new Date();
        const start = new Date(selectedAuction.startTime);
        const diff = (start - now) / (1000 * 60);
        return diff <= 20 && diff > -10;
    };

    const handleJoin = () => {
        navigate(`/auction/${selectedAuction._id}/join`);
    };

    return (
        <div className="home-page">
            <h1 className="page-title">Upcoming Auctions</h1>
            <p className="page-subtitle">
                Browse and register for exclusive live auction events
            </p>

            {auctions.map((auction) => (
                <div
                    key={auction._id}
                    className="item-card"
                    onClick={() => openAuction(auction)}
                >
                    <div className="item-header">
                        {auction.title}
                    </div>

                    <p>{auction.description}</p>

                    <div>
                        <span>📅 {new Date(auction.startTime).toDateString()}</span>{" | "}
                        <span>⏰ {new Date(auction.startTime).toLocaleTimeString()}</span>{" | "}
                        <span>👤 Hosted by {auction.hostId?.name}</span>
                    </div>

                    <div className="price">
                        {auction.items.length} items
                    </div>
                </div>
            ))}

            {selectedAuction && (
                <div className="overlay" onClick={() => setSelectedAuction(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setSelectedAuction(null)}>✕</button>

                        <h2 className="page-title">{selectedAuction.title}</h2>

                        <p className="page-subtitle">{selectedAuction.description}</p>

                        {!isRegistered ? (
                            <button
                                onClick={handleRegister}
                                disabled={user?.role !== "BIDDER"}
                            >
                                {user?.role === "BIDDER"
                                    ? "Register"
                                    : "Only bidders can register"}
                            </button>

                        ) : (
                            <>
                                <p>✅ You are registered</p>
                                {canJoinAuction() && (
                                    <button onClick={handleJoin}>Join Auction</button>
                                )}
                            </>
                        )}

                        <h3 className="featured">
                            Featured Items ({selectedAuction.items.length})
                        </h3>

                        {selectedAuction.items.map((item, i) => (
                            <div key={item._id} className="item-card">
                                <div className="item-header">Item {i + 1}</div>
                                <h4>{item.title}</h4>
                                <p className="price">STARTING BID ₹{item.startingPrice}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;