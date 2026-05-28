import API_BASE_URL from "./config";
import { useState, useEffect, useRef } from "react";
import { Routes, Route, Link, useNavigate, Navigate, useLocation } from "react-router-dom";

import OrderSuccess from "./OrderSuccess";
import MyOrders from "./MyOrders";
import Login from "./login";
import Register from "./Register";
import Home from "./Home";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import Products from "./Products";
import ProductDetails from "./ProductDetails";
import Checkout from "./Checkout";
import CheckoutSuccess from "./CheckoutSuccess";
import Cart from "./Cart";
import AdminOrders from "./AdminOrders";
import AdminDashboard from "./AdminDashboard";
import TrackOrder from "./TrackOrder";
import AddProduct from "./AddProduct";
import "./App.css";
import EditProduct from "./EditProduct";
import LandingPage from "./LandingPage";
import MyCollectibles from "./MyCollectibles";

/* =========================
   ROUTE GUARDS
========================= */
function PublicRoute({ user, children }) {
  return user ? <Navigate to="/home" replace /> : children;
}

function AdminRoute({ user, children }) {
  return user?.role?.toUpperCase() === "ADMIN"
    ? children
    : <Navigate to="/home" replace />;
}

/* =========================
   MAIN APP
========================= */
function App() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [cartCount, setCartCount] = useState(0);

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  /* Hydrate user state on mount to prevent hydration/stale state issues */
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  /* Global Toast for Order Notifications */
  const [globalToast, setGlobalToast] = useState("");
  const previousOrdersRef = useRef([]);

  useEffect(() => {
    if (!user?.token || user.role?.toUpperCase() === "ADMIN") return;

    function checkOrderStatus() {
      fetch(`${API_BASE_URL}/api/orders/my`, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
        .then(res => res.json())
        .then(data => {
          const prevOrders = previousOrdersRef.current;
          if (prevOrders.length > 0) {
            data.forEach(newOrder => {
              const prevOrder = prevOrders.find(o => o.id === newOrder.id);
              if (prevOrder && prevOrder.status !== newOrder.status) {
                const msg = `Order #${newOrder.id} status updated to ${newOrder.status}!`;

                if ("Notification" in window) {
                  if (Notification.permission === "granted") {
                    new Notification("VIVEKX Status Update", { body: msg });
                  } else if (Notification.permission !== "denied") {
                    Notification.requestPermission().then(permission => {
                      if (permission === "granted") {
                        new Notification("VIVEKX Status Update", { body: msg });
                      }
                    });
                  }
                }

                setGlobalToast(msg);
                setTimeout(() => setGlobalToast(""), 5000);
              }
            });
          }
          previousOrdersRef.current = data;
        })
        .catch(() => { });
    }

    // Initial check and regular polling
    checkOrderStatus();
    const interval = setInterval(checkOrderStatus, 5000);
    return () => clearInterval(interval);
  }, [user]);

  /* =========================
     CART COUNT
  ========================= */
  function refreshCart() {
    if (!user?.token) {
      setCartCount(0);
      return;
    }

    fetch(`${API_BASE_URL}/api/cart`, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const total = data.reduce((s, i) => s + i.quantity, 0);
        setCartCount(total);
      })
      .catch(() => setCartCount(0));
  }

  useEffect(() => {
    refreshCart();
    window.addEventListener("cart-updated", refreshCart);
    return () => window.removeEventListener("cart-updated", refreshCart);
  }, [user]);

  useEffect(() => {
    function syncUser() {
      const saved = localStorage.getItem("user");
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }

    window.addEventListener("auth-change", syncUser);
    return () => window.removeEventListener("auth-change", syncUser);
  }, []);

  /* =========================
     THEME
  ========================= */
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const [isMuted, setIsMuted] = useState(true);
  const location = useLocation();

  // HIGH-PERFORMANCE MOUSE TRACKER (CSS Variable Method - Zero Lag)
  useEffect(() => {
    if (theme !== 'panther') return;
    const hud = document.querySelector('.panther-hud');
    const handleMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      document.documentElement.style.setProperty('--mx', `${x}px`);
      document.documentElement.style.setProperty('--my', `${y}px`);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [theme]);

  // REFINED LUXURY SOUND ENGINE (Debounced & State-Aware)
  useEffect(() => {
    if (location.pathname === "/order-success" && !isMuted) {
      import("./utils/audio").then(({ playSuccessSound }) => playSuccessSound());
    }

    const handleInteraction = (e) => {
      const target = e.target;
      const text = target.innerText?.toLowerCase() || "";
      const isAction = ["buy now", "add to cart", "track my order", "authorize"].some(s => text.includes(s));
      const cursor = document.querySelector(".panther-cursor");

      // 1. Click logic for action/interaction feedback sounds
      if (e.type === "click" && !isMuted) {
        if (document.body.classList.contains("panther")) {
          import("./utils/audio").then(({ playPantherClickSound }) => playPantherClickSound());
        } else {
          import("./utils/audio").then(({ playClickSound }) => playClickSound());
        }
      }

      // 2. Hover logic for interactive elements
      if (e.type === "mouseover") {
        const card = target.closest(".poster-card, .lux-gallery-card, .product-card, .card-media");
        const btn = target.closest("button, a, [role='button'], .auth-pw-toggle, .auth-link, .clickable");
        const isInput = target.matches("input, textarea, [contenteditable='true']");
        const from = e.relatedTarget;
        const wasInCard = from ? from.closest(".poster-card, .lux-gallery-card, .product-card, .card-media") : null;

        if (card && !wasInCard && !isMuted) {
          import("./utils/audio").then(({ playHoverSound }) => playHoverSound());
        }

        if (cursor) {
          if (btn) {
            cursor.className = "panther-cursor hovering";
          } else if (isInput) {
            cursor.className = "panther-cursor typing";
          } else {
            cursor.className = "panther-cursor";
          }
        }
      }

      if (e.type === "mouseout" && cursor) {
        const to = e.relatedTarget;
        const isStillInsideInteractive = to ? to.closest("button, a, [role='button'], .auth-pw-toggle, .auth-link, .clickable, input, textarea, [contenteditable='true']") : null;
        if (!isStillInsideInteractive) {
          cursor.className = "panther-cursor";
        }
      }
    };

    window.addEventListener("click", handleInteraction);
    window.addEventListener("mouseover", handleInteraction);
    window.addEventListener("mouseout", handleInteraction);
    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("mouseover", handleInteraction);
      window.removeEventListener("mouseout", handleInteraction);
    };
  }, [location.pathname, isMuted]);

  function toggleTheme() {
    const t = theme === "dark" ? "light" : "dark";
    setTheme(t);
    localStorage.setItem("theme", t);
  }

  function handleLogout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setCartCount(0);
    window.dispatchEvent(new Event("auth-change"));
    navigate("/login");
  }

  return (
    <>
      {/* BLACK PANTHER EXCLUSIVE HUD */}
      {theme === 'panther' && (
        <>
          <div className="panther-hud">
            <div className="panther-grid" />
            <div className="panther-stars" />
            <div className="panther-particles" />

            {/* 3D KINETIC OBJECT (Simulated) */}
            <div className="panther-3d-object-wrap">
              <div className="panther-3d-object" />
            </div>

            <div className="panther-dripping">
              <span className="drip-1"></span>
              <span className="drip-2"></span>
              <span className="drip-3"></span>
            </div>
          </div>
          <div className="panther-cursor" />
        </>
      )}

      <div className="app-layout-wrapper">
        {/* =========================
            NAVBAR
        ========================= */}
        <nav className="nav-bar">

          <Link to="/home" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {theme === 'panther' && <span className="vxp-badge">P-01</span>}
            <div className="logo-text-wrap" style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
              <span className="logo-main">VIVEKX</span>
              <span className="logo-sub">Collections</span>
            </div>
          </Link>

          {/* NAV LINKS */}
          <div className="nav-links">

            {!user ? (
              <>
                <div className="nav-item">
                  <Link to="/login">Login</Link>
                  <img src="/dark/arrow.png" className="nav-hover-arrow" alt="" />
                </div>

                <div className="nav-item">
                  <Link to="/register">Register</Link>
                  <img src="/dark/arrow.png" className="nav-hover-arrow" alt="" />
                </div>
              </>
            ) : (
              <>
                <div className="nav-item">
                  <Link to="/cart">
                    Cart <span className="cart-count">{cartCount}</span>
                  </Link>
                  <img src="/dark/arrow.png" className="nav-hover-arrow" alt="" />
                </div>

                <div className="nav-item">
                  <Link to="/orders">My Orders</Link>
                  <img src="/dark/arrow.png" className="nav-hover-arrow" alt="" />
                </div>

                {user.role?.toUpperCase() === "ADMIN" && (
                  <>
                    <div className="nav-item">
                      <Link to="/admin">Dashboard</Link>
                      <img src="/dark/arrow.png" className="nav-hover-arrow" alt="" />
                    </div>

                    <div className="nav-item">
                      <Link to="/admin/orders">Orders</Link>
                      <img src="/dark/arrow.png" className="nav-hover-arrow" alt="" />
                    </div>
                  </>
                )}

                <div className="nav-item nav-user">
                  Hi, {user.name}
                  <img src="/dark/arrow.png" className="nav-hover-arrow" alt="" />
                </div>

                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}

            <button
              className={`panther-toggle ${theme === 'panther' ? 'active' : ''}`}
              onClick={() => {
                const t = theme === 'panther' ? 'dark' : 'panther';
                setTheme(t);
                localStorage.setItem('theme', t);
              }}
              title="Panther Edition"
            >
              <span>🐈‍⬛</span>
            </button>

            <button
              className={`sound-toggle ${!isMuted ? 'active' : ''}`}
              onClick={() => setIsMuted(!isMuted)}
              title="Toggle Sound"
            >
              {isMuted ? "🔇" : "🔊"}
            </button>

            <button className="theme-toggle" onClick={toggleTheme}>
              <span className="toggle-thumb" />
            </button>
          </div>
        </nav>

        {/* =========================
            PAGE CONTENT
        ========================= */}
        <div className="page-container">
          <Routes>

            {/* FIRST PAGE (Landing Page before login) */}
            <Route path="/" element={<LandingPage theme={theme || "dark"} />} />

            {/* optional alias */}
            <Route path="/landing" element={<LandingPage theme={theme || "dark"} />} />

            {/* AUTH */}
            <Route path="/login" element={<PublicRoute user={user}><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute user={user}><Register /></PublicRoute>} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* USER */}
            <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
            <Route path="/products" element={user ? <Products /> : <Navigate to="/login" />} />
            <Route path="/product/:slug" element={user ? <ProductDetails /> : <Navigate to="/login" />} />
            <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" />} />
            <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" />} />
            <Route path="/order-success" element={user ? <CheckoutSuccess /> : <Navigate to="/login" />} />
            <Route path="/track-order" element={user ? <TrackOrder /> : <Navigate to="/login" />} />
            <Route path="/track-order/:id" element={user ? <TrackOrder /> : <Navigate to="/login" />} />
            <Route path="/orders" element={user ? <MyOrders /> : <Navigate to="/login" />} />

            <Route path="/my-collectibles" element={<MyCollectibles />} />

            {/* ADMIN */}
            <Route path="/admin" element={<AdminRoute user={user}><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute user={user}><AdminOrders /></AdminRoute>} />

            <Route
              path="/admin/add-product"
              element={
                <AdminRoute user={user}>
                  <AddProduct />
                </AdminRoute>
              }
            />

            {/* EDIT */}
            <Route path="/edit/:id" element={<AdminRoute user={user}><EditProduct /></AdminRoute>} />

          </Routes>
        </div>
      </div>

      {/* =========================
          GLOBAL NOTIFICATIONS
      ========================= */}
      {globalToast && (
        <div className="lux-pd-toast show" style={{ zIndex: 999999 }}>
          <div className="toast-icon">✨</div>
          <div className="toast-text">{globalToast}</div>
        </div>
      )}
    </>
  );
}

export default App;