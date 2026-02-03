import { useEffect, useState } from "react";
import { useAuction } from "../hooks/useAuction";
import "../styles/HostDashboard.css";

export default function AvailableAuctionItems() {
  const { getAvailableItems, claimItem } = useAuction();
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const data = await getAvailableItems();
    setItems(data);
  };

  const handleClaim = async (id) => {
    await claimItem(id);
    setItems(prev => prev.filter(i => i._id !== id));
  };

  return (
    <section className="section">
      <h2>Available Items</h2>
      <p className="muted">Claim items to add to your auction</p>

      {items.map(item => (
        <div className="item-card" key={item._id}>
          <div>
            <h3>{item.title}</h3>
            <p className="muted">By {item.sellerId?.name}</p>
            <p className="price">₹{item.startingPrice}</p>
          </div>

          <button className="claimed-btn" onClick={() => handleClaim(item._id)}>
            CLAIM
          </button>
        </div>
      ))}
    </section>
  );
}
