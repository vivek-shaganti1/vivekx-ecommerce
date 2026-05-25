import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import API_BASE_URL from "./config";
function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  function loadCart() {
    if (!user?.token) return;
    fetch(`${API_BASE_URL}/api/cart`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => { setCart(data); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => { loadCart(); }, []);

  if (!user?.token) return (
    <div className="cart-page-v2 centered">
      <div className="glass-notice">
        <h2>Restricted Access</h2>
        <p>Please authenticate to view your personal cart.</p>
        <button className="btn-brand" onClick={() => navigate("/login")}>Login Now</button>
      </div>
    </div>
  );

  const subtotal = cart.reduce(
    (s, i) => s + (i.product?.price || 0) * i.quantity,
    0
  );
  const discount = Math.round(subtotal * 0.1);
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  function updateQty(id, qty) {
    if (qty < 1) return;
    // Optimistic update — show instantly, sync in background
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
    fetch(`${API_BASE_URL}/api/cart/update/${id}?quantity=${qty}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${user.token}` }
    }).catch(() => loadCart()); // revert if server fails
  }

  function removeItem(id) {
    // Optimistic update — remove instantly, sync in background
    setCart(prev => prev.filter(i => i.id !== id));
    fetch(`${API_BASE_URL}/api/cart/remove/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` }
    }).catch(() => loadCart()); // revert if server fails
  }

  return (
    <div className="cart-page-v3 animate-in">
      <div className="cart-container-max">
        <header className="cart-page-header">
          <h1>My <span className="gold-text">Collection</span></h1>
          <p>{totalItems} Premium items ready for delivery</p>
        </header>

        {cart.length === 0 && !loading ? (
          <div className="cart-empty-lux glass">
            <span className="lux-icon">🛒</span>
            <h2>Your cart is currently silent</h2>
            <p>Fill it with the finest pieces from our latest collection.</p>
            <button className="btn-brand" onClick={() => navigate("/products")}>Browse Boutique</button>
          </div>
        ) : (
          <div className="cart-grid-lux">

            {/* ITEM LIST */}
            <div className="cart-items-section">
              {cart.map(item => (
                <div key={item.id} className="cart-item-lux glass animate-in">
                  <div className="item-img-wrap">
                    <img src={item.product.imageUrl} alt={item.product.name} />
                  </div>
                  <div className="item-details-lux">
                    <div className="item-header-lux">
                      <h3>{item.product.name}</h3>
                      <button className="btn-remove-lite" onClick={() => removeItem(item.id)}>✕</button>
                    </div>
                    <p className="item-price-lux">₹{item.product.price.toLocaleString()}</p>

                    <div className="item-actions-lux">
                      <div className="qty-stepper-lux">
                        <button onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <div className="item-total-lux">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* SUMMARY PANEL */}
            <div className="cart-summary-section">
              <div className="summary-card-lux glass sticky">
                <h3>Order Summary</h3>
                <div className="summary-rows-lux">
                  <div className="sum-row">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="sum-row gold-text">
                    <span>Insider Discount</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                  <div className="sum-row">
                    <span>shipping</span>
                    <span className="success-text">COMPLIMENTARY</span>
                  </div>
                </div>
                <div className="sum-divider" />
                <div className="sum-total-row">
                  <span>Grand Total</span>
                  <span className="total-val">₹{(subtotal - discount).toLocaleString()}</span>
                </div>
                <button className="btn-checkout-lux" onClick={() => navigate("/checkout")}>
                  PROCEED TO CHECKOUT
                </button>
                <div className="summary-badges-lux">
                  <span>🛡️ SECURE</span>
                  <span>💎 AUTHENTIC</span>
                  <span>🚚 TRACKED</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;