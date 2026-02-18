import { useEffect, useState } from "react";
import { useAuction } from "../hooks/useAuction";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import '../styles/home.css';

function Home() {
    const { getUpcomingAuctions, registerForAuction, isRegistered: checkRegistration } = useAuction();
    const [auctions, setAuctions] = useState([]);
    const [selectedAuction, setSelectedAuction] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [user, setUser] = useState(null);
    const { getMe } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        fetchAuctions();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getMe();
                setUser(res.user);
            } catch {
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    const fetchAuctions = async () => {
        const auctions = await getUpcomingAuctions();

        const now = new Date();
        const upcoming = auctions
            .filter(a => new Date(a.startTime) > now)
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

        setAuctions(upcoming);
    };

    const openAuction = async (auction) => {
        setSelectedAuction(auction);

        try {
            const res = await checkRegistration(auction._id);
            setIsRegistered(res.registered);
        } catch (err) {
            console.error("Failed to check registration", err);
            setIsRegistered(false);
        }
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
                        <div className="modal-header">
                            <h2>{selectedAuction.title}</h2>
                            <button
                                className="close-btn"
                                onClick={() => setSelectedAuction(null)}
                            >
                                ✕
                            </button>
                        </div>

                        <p className="auction-desc">{selectedAuction.description}</p>

                        <div className="auction-action">
                            {!isRegistered ? (
                                <button
                                    className="primary-action-btn"
                                    onClick={handleRegister}
                                    disabled={user?.role !== "BIDDER"}
                                >
                                    {user?.role === "BIDDER"
                                        ? "Register for Auction"
                                        : "Only bidders can register"}
                                </button>
                            ) : (
                                <>
                                    <span className="registered-tag">✅ You are registered</span>
                                    {canJoinAuction() && (
                                        <button className="join-btn" onClick={handleJoin}>
                                            Join Auction
                                        </button>
                                    )}
                                </>
                            )}
                        </div>

                        <h3 className="featured">
                            Featured Items ({selectedAuction.items.length})
                        </h3>

                        {selectedAuction.items.map((item, i) => (
                            <div key={item._id} className="featured-row">

                                <div className="featured-image">
                                    <img
                                        src={
                                            item.images && item.images.length > 0
                                                ? item.images[0]
                                                : "/placeholder.png"
                                        }
                                        alt={item.title}
                                    />
                                </div>

                                <div className="featured-details">
                                    <div className="lot-number">Item {i + 1}</div>

                                    <h4 className="item-title">{item.title}</h4>

                                    <p className="description">
                                        {item.description}
                                    </p>

                                    <p className="starting-price">
                                        Starting Price ₹{item.startingPrice}
                                    </p>
                                </div>

                            </div>
                        ))}

                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;