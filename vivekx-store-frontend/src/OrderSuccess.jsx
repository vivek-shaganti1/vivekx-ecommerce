import { useNavigate } from "react-router-dom";
import OrderStatus from "./OrderStatus";
import "./App.css";

function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="checkout-wrapper">
      <div className="checkout-card">
        <h1>✅ Payment Successful</h1>

        <p style={{ marginTop: "8px", opacity: 0.8 }}>
          Thank you for shopping with <b>VIVEKX</b>.
        </p>

        {/* 🔥 ORDER STATUS PROGRESS */}
        <div style={{ marginTop: "24px" }}>
          <OrderStatus status="PAID" />
        </div>

        {/* ACTIONS */}
        <div style={{ marginTop: "28px", display: "flex", gap: "12px" }}>
          <button
            className="pay-btn"
            onClick={() => navigate("/orders")}
          >
            View My Orders
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;