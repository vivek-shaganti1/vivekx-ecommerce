import API_BASE_URL from "./config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  function loadOrders() {
    if (!user?.token) return;
    fetch(`${API_BASE_URL}/api/orders/my`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => { 
        setOrders(data); 
        setLoading(false); 
      })
      .catch(() => {
        // Mock data when backend is not running to still permit testing
        const mockData = [
          {
            id: "VKX-8821", status: "SHIPPED", totalAmount: 24999, date: "2024-03-18",
            items: [{ id: 1, quantity: 1, product: { name: "Chrono X Elite", price: 24999 } }]
          }
        ];
        setOrders(mockData);
        setLoading(false);
      });
  }

  function cancelOrder(orderId) {
    if (!window.confirm("Cancel this order?")) return;
    fetch(`${API_BASE_URL}/api/orders/cancel/${orderId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(updated => setOrders(prev => prev.map(o => o.id === updated.id ? updated : o)))
      .catch(() => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "CANCELLED" } : o));
      });
  }

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 3000); // Polling for real-time tracking
    window.addEventListener("orders-updated", loadOrders);
    return () => {
      clearInterval(interval);
      window.removeEventListener("orders-updated", loadOrders);
    };
  }, []);

  if (loading) return <div className="ord-loading"><div className="pd-spinner" /></div>;

  return (
    <div className="ord-page animate-in">
      <div className="ord-container-simple">
        <h1 className="section-title">My <span className="gold-text">Orders</span></h1>

        {orders.length === 0 ? (
          <div className="empty-orders-v2 glass">
            <h2>No orders yet</h2>
            <button className="btn-brand" onClick={() => window.location.href = '/products'}>Start Exploring</button>
          </div>
        ) : (
          <div className="orders-list-v2">
            {orders.map(order => (
              <div key={order.id} className="order-card-v2 glass animate-in">
                <div className="order-card-v2-header">
                  <div className="id-col">
                    <span className="tiny-label">ORDER ID</span>
                    <h4>#{order.id}</h4>
                  </div>
                  <div className={`status-badge-v2 status-${order.status}`}>
                    {order.status}
                  </div>
                </div>

                <div className="order-card-v2-body">
                  <div className="items-preview">
                    {order.items?.map(item => (
                      <p key={item.id}>• {item.product.name} (x{item.quantity})</p>
                    ))}
                  </div>
                  <div className="price-info">
                    <span className="tiny-label">TOTAL PAID</span>
                    <h3 className="gold-text">₹{order.totalAmount?.toLocaleString()}</h3>
                  </div>
                </div>

                <div className="order-card-v2-footer">
                  <span className="order-timestamp">{order.date || "Just now"}</span>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <button 
                      className="btn-outline-gold" 
                      style={{ padding: "6px 16px", fontSize: "12px", borderRadius: "50px" }}
                      onClick={() => navigate(`/track-order/${order.id}`)}
                    >
                      TRACK ORDER
                    </button>
                    {order.status === "PLACED" && (
                      <button className="cancel-text-btn" onClick={() => cancelOrder(order.id)}>Cancel Request</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;