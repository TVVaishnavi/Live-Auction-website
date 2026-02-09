import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuction } from "../hooks/useAuction";

export default function HostAuctionSummary() {
  const { auctionId } = useParams();
  const { getAuctionById, finalizeItem } = useAuction();
  const [items, setItems] = useState([]);
  const [auction, setAuction] = useState(null);

  useEffect(() => {
    loadAuction();
  }, []);

  const loadAuction = async () => {
    const data = await getAuctionById(auctionId);
    setAuction(data);
    setItems(data.items || []);
  };

  const updateItem = (itemId, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item._id === itemId
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const saveItem = async (item) => {
    await finalizeItem(item._id, {
      winnerName: item.winnerName,
      finalPrice: item.finalPrice,
    });

    setItems((prev) =>
      prev.map((i) =>
        i._id === item._id
          ? { ...i, isFinalized: true }
          : i
      )
    );
  };

  if (!auction) return <p>Loading auction summary...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{auction.title} – Summary</h1>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Item</th>
            <th>Seller</th>
            <th>Winner</th>
            <th>Final Price</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              {/* ITEM NAME */}
              <td>{item.title}</td>

              {/* SELLER */}
              <td>{item.sellerName || "—"}</td>

              {/* WINNER */}
              <td>
                {item.isFinalized ? (
                  item.winnerName || "—"
                ) : (
                  <input
                    type="text"
                    value={item.winnerName || ""}
                    onChange={(e) =>
                      updateItem(item._id, "winnerName", e.target.value)
                    }
                  />
                )}
              </td>

              {/* FINAL PRICE */}
              <td>
                {item.isFinalized ? (
                  `₹${item.finalPrice}`
                ) : (
                  <input
                    type="number"
                    value={item.finalPrice || ""}
                    onChange={(e) =>
                      updateItem(item._id, "finalPrice", e.target.value)
                    }
                  />
                )}
              </td>

              {/* SAVE BUTTON */}
              <td>
                {!item.isFinalized && (
                  <button onClick={() => saveItem(item)}>
                    Save
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

