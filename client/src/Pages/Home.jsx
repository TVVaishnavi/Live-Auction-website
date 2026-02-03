import { useEffect, useState } from "react";
import { useAuction } from "../hooks/useAuction";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";

function Home() {
    const { getPublishedAuctions, registerForAuction } = useAuction();
    const [auctions, setAuctions] = useState([]);
    const [selectedAuction, setSelectedAuction] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [justRegistered, setJustRegistered] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAuctions();
    }, []);

    const fetchAuctions = async () => {
        const items = await getPublishedAuctions();

        const map = {};
        items.forEach((item) => {
            const key = `${item.liveTitle}-${item.startTime}`;
            if (!map[key]) {
                map[key] = {
                    auctionKey: key,
                    liveTitle: item.liveTitle,
                    liveDescription: item.liveDescription,
                    startTime: item.startTime,
                    host: item.hostEmail,
                    items: [],
                };
            }
            map[key].items.push(item);
        });

        const now = new Date();
        const grouped = Object.values(map)
            .filter((a) => new Date(a.startTime) > now)
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

        setAuctions(grouped);
    };

    const openAuction = async (auction) => {
        try {
            const res = await apiFetch(
                `/items/${auction.auctionKey}/is-registered`
            );

            setIsRegistered(res.registered);
        } catch {
            setIsRegistered(false);
        }
        setSelectedAuction(auction);
    };

    const handleRegister = async () => {
        try {
            await registerForAuction(selectedAuction.auctionKey);

            setIsRegistered(true);
            alert("Registered successfully!");
        } catch (err) {
            console.error("Register failed:", err);
            alert("Registration failed");
        }
    };



    const canJoinAuction = () => {
        const now = new Date();
        const start = new Date(selectedAuction.startTime);
        const diff = (start - now) / (1000 * 60);
        return diff <= 20 && diff > -10;
    };

    const handleJoin = () => {
        navigate(`/auction/${selectedAuction.auctionKey}/join`);
    };

    return (
        <div style={styles.page}>
            <h1 style={styles.heading}>Upcoming Auctions</h1>
            <p style={styles.subheading}>
                Browse and register for exclusive live auction events
            </p>

            {auctions.map((auction, index) => (
                <div
                    key={index}
                    style={styles.collectionCard}
                    onClick={() => openAuction(auction)}
                >
                    <div style={styles.collectionHeader}>
                        {auction.liveTitle}
                    </div>

                    <div style={styles.collectionBody}>
                        <h2 style={styles.title}>{auction.liveTitle}</h2>
                        <p style={styles.desc}>{auction.liveDescription}</p>

                        <div style={styles.meta}>
                            <span>📅 {new Date(auction.startTime).toDateString()}</span>
                            <span>⏰ {new Date(auction.startTime).toLocaleTimeString()}</span>
                            <span>👤 Hosted by {auction.host}</span>
                        </div>

                        <div style={styles.footer}>
                            <span>{auction.items.length} items</span>
                            <span>45 registered</span>
                        </div>
                    </div>
                </div>
            ))}

            {selectedAuction && (
                <div style={styles.overlay} onClick={() => setSelectedAuction(null)}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <button
                            style={styles.close}
                            onClick={() => setSelectedAuction(null)}
                        >
                            ✕
                        </button>

                        <h2 style={styles.modalTitle}>{selectedAuction.liveTitle}</h2>

                        <div style={styles.modalMeta}>
                            <span>📅 {new Date(selectedAuction.startTime).toDateString()}</span>
                            <span>⏰ {new Date(selectedAuction.startTime).toLocaleTimeString()}</span>
                            <span>👤 {selectedAuction.host}</span>
                            <span>👥 45 bidders registered</span>
                        </div>

                        <p style={styles.modalDesc}>{selectedAuction.liveDescription}</p>

                        {!isRegistered ? (
                            <button style={styles.primaryBtn} onClick={handleRegister}>
                                Register
                            </button>
                        ) : (
                            <>
                                <p style={styles.registeredText}>
                                    ✅ You have been registered for this auction
                                </p>

                                {canJoinAuction() ? (
                                    <button style={styles.primaryBtn} onClick={handleJoin}>
                                        Join Auction
                                    </button>
                                ) : (
                                    <p style={styles.disabled}>
                                        Join button will be enabled 20 minutes before start time
                                    </p>
                                )}
                            </>
                        )}

                        <h3 style={styles.featured}>
                            Featured Items ({selectedAuction.items.length})
                        </h3>

                        {selectedAuction.items.map((item, i) => (
                            <div key={item._id} style={styles.itemCard}>
                                <div style={styles.itemHeader}>Item {i + 1}</div>
                                <h4>{item.title}</h4>
                                <p style={styles.artist}>By {item.artist || "Unknown"}</p>
                                <p style={styles.price}>
                                    STARTING BID ₹{item.startingPrice}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    page: {
        padding: "40px",
        background: "#fafafa",
    },

    heading: {
        color: "#000000",
        fontSize: "42px",
        fontFamily: "serif",
        fontWeight: 500,
        marginTop: "62px",
        position: "relative",
        zIndex: 2,
    },

    subheading: {
        color: "#4b5563",
        marginBottom: "32px",
    },

    collectionCard: {
        background: "#fff",
        borderRadius: "14px",
        marginBottom: "32px",
        cursor: "pointer",
        boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
    },

    collectionHeader: {
        background: "#e5e7eb",
        padding: "14px",
        textAlign: "center",
        fontSize: "26px",
        fontFamily: "serif",
        color: "#6b7280",
    },

    collectionBody: {
        padding: "24px",
    },

    title: {
        fontSize: "28px",
        fontFamily: "serif",
    },

    desc: {
        marginTop: "12px",
        color: "#374151",
        lineHeight: 1.7,
    },

    meta: {
        marginTop: "18px",
        display: "flex",
        gap: "18px",
        color: "#6b7280",
        fontSize: "14px",
    },

    footer: {
        marginTop: "18px",
        display: "flex",
        justifyContent: "space-between",
        fontWeight: 500,
    },

    overlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },

    modal: {
        background: "#fff",
        width: "640px",
        maxHeight: "85vh",
        overflowY: "auto",
        padding: "32px",
        borderRadius: "16px",
        position: "relative",
    },

    close: {
        position: "absolute",
        top: 16,
        right: 16,
        border: "none",
        background: "transparent",
        fontSize: "20px",
        cursor: "pointer",
    },

    modalTitle: {
        fontSize: "32px",
        fontFamily: "serif",
    },

    modalMeta: {
        marginTop: "14px",
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
        color: "#6b7280",
    },

    modalDesc: {
        marginTop: "18px",
        lineHeight: 1.8,
    },

    primaryBtn: {
        marginTop: "24px",
        padding: "14px",
        width: "100%",
        background: "#0f172a",
        color: "#fff",
        border: "none",
        fontWeight: 600,
        cursor: "pointer",
    },

    disabled: {
        marginTop: "18px",
        color: "#6b7280",
    },

    featured: {
        marginTop: "36px",
        fontSize: "24px",
        fontFamily: "serif",
    },

    itemCard: {
        marginTop: "18px",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: "18px",
    },

    itemHeader: {
        textAlign: "center",
        color: "#9ca3af",
        marginBottom: "10px",
    },

    artist: {
        color: "#6b7280",
    },

    price: {
        marginTop: "8px",
        fontWeight: 700,
    },
};

export default Home;
