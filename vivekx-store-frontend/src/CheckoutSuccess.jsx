import { useNavigate, useLocation } from "react-router-dom";
import "./App.css";

function CheckoutSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="checkout-success-lux animate-in">
      <div className="success-content jelly-container jelly-float">
        <div className="success-icon">✨</div>
        <h1 className="gold-text">MISSION ACCOMPLISHED</h1>
        <p className="success-msg">
          Your order has been officially registered in the VIVEKX archives.
          Our artisans are now preparing your collection.
        </p>

        <div className="success-actions">
          <button
            className="btn-jelly"
            onClick={() => navigate(orderId ? `/track-order/${orderId}` : "/track-order")}
          >
            🚀 TRACK MY ORDER
          </button>

          <button
            className="btn-jelly btn-jelly-orange"
            onClick={() => navigate("/home")}
          >
            BACK TO BOUTIQUE
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSuccess;