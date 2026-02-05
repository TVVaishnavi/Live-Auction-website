import { useEffect, useState } from "react";
import { useAuction } from "../hooks/useAuction";
import CreateItemModal from "../components/CreateItem";
import "../styles/SellerDashboard.css";

function SellerDashboard() {
    const { getMyAuctionItems, createAuctionItem } = useAuction();
    const [items, setItems] = useState([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchItems = async () => {
            const data = await getMyAuctionItems();
            setItems(data);
        };
        fetchItems();
    }, []);

    const handleCreateItem = async (data) => {
        try {
            await createAuctionItem(data);

            const updated = await getMyAuctionItems();
            setItems(updated);

            setShowForm(false);
        } catch (err) {
            alert(err.message);
        }
    };

    const activeCount = items.filter(i => i.status === "AVAILABLE").length;
    const pendingCount = items.filter(i => i.status === "CLAIMED").length;
    const soldCount = items.filter(i => i.status === "COMPLETED").length;

    const totalSales = items
        .filter(i => i.finalPrice)
        .reduce((sum, i) => sum + i.finalPrice, 0);

    return (
        <div className="seller-dashboard">
            <div className="seller-header">
                <div>
                    <h1>Seller Dashboard</h1>
                    <p>Manage your listings and auctions</p>
                </div>
                <button
                    className="primary-btn"
                    onClick={() => setShowForm(true)}
                >
                    CREATE ITEM
                </button>
            </div>

            <div className="stats-grid">
                <StatCard label="ACTIVE LISTINGS" value={activeCount} />
                <StatCard label="TOTAL SALES" value={`₹${totalSales}`} />
                <StatCard label="PENDING ITEMS" value={pendingCount} />
                <StatCard label="SOLD ITEMS" value={soldCount} />
            </div>

            <div className="listings">
                <h2>Your Listings</h2>

                <table>
                    <thead>
                        <tr>
                            <th>ITEM</th>
                            <th>STARTING PRICE</th>
                            <th>FINAL PRICE</th>
                            <th>STATUS</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.map(item => (
                            <tr key={item._id}>
                                <td className="item-cell">
                                    <div className="item-image">
                                        <img
                                            src={
                                                item.images && item.images.length > 0
                                                    ? item.images[0]
                                                    : "/placeholder.png"
                                            }
                                            alt={item.title}
                                        />

                                    </div>


                                    <div>
                                        <strong>{item.title}</strong>
                                        <p className="muted">Listed</p>
                                    </div>
                                </td>
                                <td>₹{item.startingPrice}</td>
                                <td>{item.finalPrice ? `₹${item.finalPrice}` : "-"}</td>
                                <td>
                                    <span className={`status ${item.status.toLowerCase()}`}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <CreateItemModal
                    onClose={() => setShowForm(false)}
                    onCreate={handleCreateItem}
                />
            )}
        </div>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="stat-card">
            <p>{label}</p>
            <h3>{value}</h3>
        </div>
    );
}

export default SellerDashboard;
