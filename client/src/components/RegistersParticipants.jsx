import { useEffect, useState } from "react";
import { useAuction } from "../hooks/useAuction";
import "../styles/HostDashboard.css";

function RegisteredParticipants({ auction }) {
  const { getHostAuctionRegistrations } = useAuction();
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (!open) {
      setLoading(true);
      const data = await getHostAuctionRegistrations(
        auction.liveTitle,
        auction.startTime
      );
      setUsers(data);
      setLoading(false);
    }
    setOpen(!open);
  };

  return (
    <div className="auction-card">
      <div className="auction-header" onClick={toggle}>
        <div>
          <h3>{auction.liveTitle}</h3>

          <div className="auction-meta">
            <span>
              📅{" "}
              {new Date(auction.startTime).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>

            <span>⏰ {new Date(auction.startTime).toLocaleTimeString()}</span>
            <span>📦 {auction.items.length} items</span>
            <span>👥 {users.length} registered</span>
          </div>
        </div>

        <button className="toggle-btn">{open ? "˄" : "˅"}</button>
      </div>

      {open && (
        <div className="auction-body">
          <h4>Registered Participants</h4>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>REGISTERED ON</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u._id}>
                    <td>{i + 1}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      {new Date(u.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default RegisteredParticipants;
