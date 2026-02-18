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
    window.dispatchEvent(new Event("item-claimed"));
  };

  useEffect(() => {
    loadItems();

    const handleUnclaimed = () => loadItems();

    window.addEventListener("item-unclaimed", handleUnclaimed);

    return () =>
      window.removeEventListener("item-unclaimed", handleUnclaimed);
  }, []);


  return (
    <section className="section">
      <h2>Available Items</h2>
      <p className="muted">Claim items to add to your auction</p>

      {items.map(item => (
        <div className="available-card" key={item._id}>

          <div className="available-image">
            <img
              src={
                item.images && item.images.length > 0
                  ? item.images[0]
                  : "/placeholder.png"
              }
              alt={item.title}
            />
          </div>

          <div className="available-info">
            <h3>{item.title}</h3>
            <p className="muted">By {item.sellerId?.name}</p>

            <p className="description">
              {item.description?.slice(0, 120) || "No description"}
              {item.description?.length > 120 && "..."}
            </p>

            <p className="price">₹{item.startingPrice}</p>
          </div>

          <button
            className="claim-btn"
            onClick={() => handleClaim(item._id)}
          >
            CLAIM
          </button>
        </div>
      ))}


    </section>
  );
}
