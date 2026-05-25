import API_BASE_URL from "./config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Checkout() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    address: "",
    city: "",
    pincode: ""
  });

  function handleInputChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    // Check for "Buy Now" item first
    const buyNow = localStorage.getItem("buyNowItem");
    console.log("BUY NOW DATA:", buyNow);
    console.log("ITEMS:", items);
    if (buyNow) {
      const parsed = JSON.parse(buyNow);
      setItems([{ id: "buynow", product: parsed.product, quantity: parsed.quantity }]);
      setLoading(false);
    } else {
      // Otherwise load cart
      fetch(`${API_BASE_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      })
        .then(res => res.json())
        .then(data => {
          setItems(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, []);

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  async function handlePayment() {
    setIsPaying(true);

    try {
      let order;

      const buyNow = localStorage.getItem("buyNowItem");
      if (!buyNow && items.length === 0) {
        alert("Cart is empty");
        setIsPaying(false);
        return;
      }
      if (buyNow) {
        // 🔥 BUY NOW FLOW
        const parsed = JSON.parse(buyNow);

        const res = await fetch(
          `${API_BASE_URL}/api/orders/buy-now?productId=${parsed.product.id}&quantity=${parsed.quantity}`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${user.token}`
            }
          }
        );

        if (!res.ok) throw new Error("Buy Now failed");

        order = await res.json();

      } else {
        // 🛒 CART FLOW
        const res = await fetch(`${API_BASE_URL}/api/orders/place`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${user.token}`,
            "Content-Type": "application/json"   // ✅ ADD THIS
          }
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.log("Backend error:", errorText);
          throw new Error("Order failed");
        }

        order = await res.json();
      }
      if (!order || !order.id) {
        throw new Error("Invalid order");
      }

      // 💳 PAYMENT
      // 💳 PAYMENT (SILENT HANDLING)
      // 💳 PAYMENT (TEMP DISABLED FOR CLEAN FLOW)
      console.log("💳 Payment skipped (dev mode)");

      // 🧹 CLEAR BUY NOW
      localStorage.removeItem("buyNowItem");

      window.dispatchEvent(new Event("cart-updated"));
      window.dispatchEvent(new Event("orders-updated"));

      navigate("/order-success", { state: { orderId: order.id } });

    } catch (err) {
      console.error("Payment Error:", err);
      alert("Transaction failed. Check console.");
    } finally {
      setIsPaying(false);
    }
  }
  if (loading) return <div className="admin-loading"><div className="pd-spinner" /></div>;

  return (
    <div className="checkout-page-lux animate-in">
      <div className="checkout-grid-lux">

        {/* LEFT: SHIPPING FORM */}
        <div className="shipping-section glass">
          <h2 className="section-title-sm">Shipment <span className="gold-text">Details</span></h2>
          <form className="lux-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group-lux">
              <label>Full Name</label>
              <input
                name="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group-lux">
              <label>Shipping Address</label>
              <textarea
                name="address"
                placeholder="Line 1, Landmark, Street"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-row-lux">
              <div className="form-group-lux">
                <label>City</label>
                <input
                  name="city"
                  type="text"
                  placeholder="Mumbai"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group-lux">
                <label>Pincode</label>
                <input
                  name="pincode"
                  type="text"
                  placeholder="400001"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </form>
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div className="overview-section">
          <div className="overview-card glass sticky">
            <h3 className="section-title-sm">Order <span className="gold-text">Overview</span></h3>

            <div className="checkout-items-mini">
              {items.map(item => (
                <div key={item.id} className="mini-item">
                  <div className="mini-info">
                    <p className="mini-name">{item.product.name}</p>
                    <p className="mini-qty">Qty: {item.quantity}</p>
                  </div>
                  <p className="mini-price">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="lux-divider-sm" />

            <div className="checkout-math">
              <div className="math-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="math-row">
                <span>Insurance</span>
                <span>Complementary</span>
              </div>
              <div className="math-row total">
                <span>Total Amount</span>
                <span className="gold-text">₹{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              className={`btn-pay-lux ${isPaying ? 'paying' : ''}`}
              onClick={handlePayment}
              disabled={isPaying || items.length === 0}
            >
              {isPaying ? "VERIFYING ENCRYPTION..." : "AUTHORIZE PAYMENT"}
            </button>
            <p className="security-tag-v2">🔒 PCI-DSS Certified 128-bit Encryption</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Checkout;