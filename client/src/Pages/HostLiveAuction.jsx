import { useEffect, useState } from "react";
import "../styles/HostLiveAuction.css";

export default function HostLiveAuction() {
    const [items, setItems] = useState([]);
    const [activeItem, setActiveItem] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    
    useEffect(() => {
        if (!activeItem) return;

        const interval = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [activeItem]);

    const startItem = (item) => {
        setActiveItem(item);

        const now = Date.now();
        const fifteenMinutes = 15 * 60 * 1000;

        setEndTime(now + fifteenMinutes);
    };
    useEffect(() => {
        if (!endTime) return;

        const interval = setInterval(() => {
            const diff = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            setTimeLeft(diff);

            if (diff === 0) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [endTime]);


    const formatTime = (seconds) => {
        const m = String(Math.floor(seconds / 60)).padStart(2, "0");
        const s = String(seconds % 60).padStart(2, "0");
        return `${m}:${s}`;
    };


    return (
        <div className="live-container">

            <header className="live-header">
                <div>
                    <h1>LIVE AUCTION</h1>
                    <p>Spring Art Collection - February 15, 2026</p>
                </div>

                <div className="view-toggle">
                    <button className="active">HOST VIEW</button>
                    <span className="live-dot">● LIVE</span>
                </div>
            </header>

            <section className="main-panel">
                {!activeItem ? (
                    <div className="empty-state">
                        <div className="clock-icon">⏱</div>
                        <h2>Select an Item to Start</h2>
                        <p>Choose an item from the list below to begin the auction</p>
                    </div>
                ) : (
                    <div className="active-item">
                        <h2>{activeItem.title}</h2>

                        <img
                            src={activeItem.images?.[0]}
                            alt={activeItem.title}
                            className="active-item-image"
                        />

                        <p className="desc">{activeItem.description}</p>

                        <p className="price">₹{activeItem.startingPrice}</p>

                        <div className="timer">{formatTime(timeLeft)}</div>
                    </div>
                )}
            </section>

            <section className="items-section">
                <h3>Available Items</h3>

                {items.map((item, idx) => (
                    <div
                        key={item._id}
                        className="item-card"
                        onClick={() => startItem(item)}
                    >
                        <div className="item-label">Item {idx + 1}</div>
                        <h4>{item.title}</h4>
                        <p>{item.description}</p>
                        <span className="green">₹{item.price}</span>
                    </div>
                ))}
            </section>
        </div>
    );
}
