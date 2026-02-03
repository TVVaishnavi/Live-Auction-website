import { useEffect, useState } from "react";
import { useAuction } from "../hooks/useAuction";
import "../styles/hostDashboard.css";

export default function MyAuctionList() {
  const { getClaimedItems, scheduleAuction, publishAuction } = useAuction();
  const [items, setItems] = useState([]);
  const [image, setImage] = useState("");
  const [form, setForm] = useState({
    auctionName: "",
    meetLink: "",
    startTime: "",
    description: "",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const data = await getClaimedItems();
    setItems(data);
  };


  const postAuction = async () => {
    if (items.length < 5) return alert("Minimum 5 items required");

    for (const item of items) {
      await scheduleAuction(item._id, {
        liveTitle: form.auctionName,
        liveDescription: form.description,
        meetLink: form.meetLink,
        startTime: form.startTime,
        auctionImage: image,
      });

      await publishAuction(item._id);
    }

    alert("Auction posted successfully");
  };

  return (
    <section className="section">
      <h2>Current Auction List</h2>
      <p className="muted">{items.length} / 5 minimum items</p>

      {items.map(item => (
        <div className="auction-row" key={item._id}>
          <div>
            <h4>{item.title}</h4>
            <p className="muted">₹{item.startingPrice}</p>
          </div>
          <span className="remove-btn">×</span>
        </div>
      ))}

      <h2>Create Auction Event</h2>

      <input
        placeholder="AUCTION NAME"
        onChange={e => setForm({ ...form, auctionName: e.target.value })}
      />

      <input
        placeholder="GOOGLE MEET LINK"
        onChange={e => setForm({ ...form, meetLink: e.target.value })}
      />

      <input
        type="datetime-local"
        onChange={e => setForm({ ...form, startTime: e.target.value })}
      />

      <textarea
        placeholder="Auction description"
        onChange={e => setForm({ ...form, description: e.target.value })}
      />

      <button className="primary-btn" onClick={postAuction}>
        POST AUCTION
      </button>
    </section>
  );
}
