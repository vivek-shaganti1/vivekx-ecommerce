import API_BASE_URL from "./config";
import { useEffect, useState } from "react";
import "./App.css";

function AdminOrders() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [isDark, setIsDark] = useState(document.body.classList.contains("dark"));

  useEffect(() => {
    const observer = new MutationObserver(() => setIsDark(document.body.classList.contains("dark")));
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  async function loadOrders() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/all`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      const data = await res.json();
      setOrders(data);
    } catch (e) { console.error(e); }
  }

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter(o => {
    const term = search.toLowerCase();
    const matchSearch = o.user?.name?.toLowerCase().includes(term) || String(o.id).includes(term);
    const matchFilter = filter === "ALL" || o.status === filter;
    return matchSearch && matchFilter;
  });

  async function updateStatus(orderId, status) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/status/${orderId}?status=${status}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
      // Notify other components
      window.dispatchEvent(new Event("orders-updated"));
    } catch (e) { alert("Failed to update status"); }
  }

  return (
    <div className="admin-container animate-in">
      <header className="admin-hero">
        <div>
          <h1>Global <span className="gold-text">Shipments</span></h1>
          <p>Real-time order fulfillment & logistics</p>
        </div>
      </header>

      {/* FILTER BAR */}
      <div className="admin-status-bar-premium glass">
        <div className="search-wrap">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search Order ID or Customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-chips">
          {["ALL", "PLACED", "SHIPPED", "DELIVERED"].map(f => (
            <button
              key={f}
              className={`chip ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-orders-list">
        {filteredOrders.length === 0 ? (
          <div className="no-results glass"><p>No matching orders found.</p></div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="admin-order-card glass animate-in">
              <div className="order-main">
                <div className="order-id">#{order.id}</div>
                <div className="order-cust">
                  <h4>{order.user.name}</h4>
                  <p>{order.user.email}</p>
                </div>
                <div className="order-amt gold-text">₹{order.totalAmount.toLocaleString()}</div>
                <div className={`order-status-tag status-${order.status}`}>{order.status}</div>
              </div>

              <div className="order-footer">
                <div className="order-actions">
                  {order.status === "PLACED" && (
                    <button className="btn-brand-sm" onClick={() => updateStatus(order.id, "SHIPPED")}>
                      🚀 MARK AS SHIPPED
                    </button>
                  )}
                  {order.status === "SHIPPED" && (
                    <button className="btn-brand-sm success" onClick={() => updateStatus(order.id, "DELIVERED")}>
                      ✅ MARK AS DELIVERED
                    </button>
                  )}
                </div>
                <div className="order-date-label">Received: {order.date || "Today"}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminOrders;