import { useEffect, useState } from "react";
import { useAuction } from "../hooks/useAuction";
import "../styles/hostDashboard.css";

export default function MyAuctionList() {
  const { getClaimedItems, createAuction, unclaimItem } = useAuction();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    auctionName: "",
    meetLink: "",
    startTime: "",
    description: "",
  });

  useEffect(() => {
    fetchItems();

    const handleClaimed = () => {
      fetchItems();
    };

    window.addEventListener("item-claimed", handleClaimed);

    return () => window.removeEventListener("item-claimed", handleClaimed);
  }, []);

  const handleRemove = async (id) => {
    try {
      await unclaimItem(id);

      setItems(prev => prev.filter(i => i._id !== id));

      window.dispatchEvent(new Event("item-unclaimed"));
    } catch (err) {
      console.error("Failed to remove item: ", err);
      alert("Failed to remove item");
    }
  };

  const fetchItems = async () => {
    const data = await getClaimedItems();
    setItems(data);
  };


  const postAuction = async () => {
    if (!isFormValid) {
      return alert("Please fill all required fields");
    }

    await createAuction({
      title: form.auctionName,
      description: form.description,
      startTime: form.startTime,
      meetLink: form.meetLink,
      itemIds: items.map(i => i._id),
    });

    alert("Auction created successfully");

    setForm({
      auctionName: "",
      meetLink: "",
      startTime: "",
      description: "",
    });

    setItems([]);

    window.dispatchEvent(new Event("auction-created"));
  };


  const isFormValid =
    form.auctionName.trim() !== "" &&
    form.description.trim() !== "" &&
    form.startTime !== "" &&
    items.length >= 5;

  const getMinDateTime = () => {
    const now = new Date();

    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - offset * 60 * 1000);

    return local.toISOString().slice(0, 16);
  };

  const [minDateTime, setMinDateTime] = useState(getMinDateTime());

  useEffect(() => {
    const updateMin = () => setMinDateTime(getMinDateTime());
    updateMin();
    const interval = setInterval(updateMin, 60000);

    return () => clearInterval(interval);
  }, []);



  return (
    <section className="section">
      <h2>Current Auction List</h2>
      <p className="muted">{items.length} / 5 minimum items</p>

      {items.map(item => (
        <div className="current-card" key={item._id}>
          <div className="current-info">
            <h3>{item.title}</h3>
            <p className="muted">Starting Price</p>
            <p className="price">₹{item.startingPrice}</p>
          </div>

          <button className="remove-btn" onClick={() => handleRemove(item._id)}>×</button>
        </div>
      ))}

      <h2>Create Auction Event</h2>

      <input
        placeholder="AUCTION NAME" value={form.auctionName}
        onChange={e => setForm({ ...form, auctionName: e.target.value })}
      />

      <input
        placeholder="GOOGLE MEET LINK" value={form.meetLink}
        onChange={e => setForm({ ...form, meetLink: e.target.value })}
      />

      <input
        type="datetime-local"
        value={form.startTime}
        min={minDateTime}
        step="60"
        onChange={(e) => {
          const selected = new Date(e.target.value);
          const now = new Date();

          if (selected <= now) {
            alert("Please choose a future time");
            return; 
          }

          setForm({ ...form, startTime: e.target.value });
        }}
      />


      <textarea
        placeholder="Auction description" value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
      />

      <button
        className="primary-btn"
        onClick={postAuction}
        disabled={!isFormValid}
      >
        POST AUCTION
      </button>

    </section>
  );
}
