import API_BASE_URL from "./config";
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";

/* ── tiny particle data ── */
const PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  left: `${10 + i * 11}%`,
  top: `${15 + ((i * 37) % 70)}%`,
  dur: `${3.5 + (i % 3)}s`,
  delay: `${(i * 0.6) % 2.8}s`,
}));

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [focused, setFocused] = useState("");
  const navigate = useNavigate();
  const cardRef = useRef(null);

  /* ── Ring click effect ── */
  function spawnRing(e) {
    const ring = document.createElement("div");
    ring.className = "auth-ring";
    ring.style.left = `${e.clientX - 20}px`;
    ring.style.top  = `${e.clientY - 20}px`;
    document.body.appendChild(ring);
    setTimeout(() => ring.remove(), 650);
  }

  /* ── Card tilt on mouse move (desktop only) ── */
  useEffect(() => {
    const card = cardRef.current;
    if (!card || window.innerWidth < 768) return;

    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(900px) rotateY(${dx * 4}deg) rotateX(${-dy * 3}deg) translateZ(0)`;
    };

    const onLeave = () => {
      card.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0)";
      card.style.transition = "transform 0.5s ease";
    };

    const parent = card.parentElement;
    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);
    return () => {
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
    if (message.text) setMessage({ text: "", type: "" });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      }),
    })
      .then(async (res) => {
        const text = await res.text();
        let json;
        try { json = JSON.parse(text); } catch {
          throw new Error("Server returned an unexpected response. Please try again.");
        }
        if (!res.ok || json.success === false)
          throw new Error(json.message || "Login failed");
        return json;
      })
      .then((user) => {
        localStorage.setItem("user", JSON.stringify(user));
        window.dispatchEvent(new Event("auth-change"));
        setMessage({ text: "Welcome back! Redirecting…", type: "success" });
        setTimeout(() => navigate("/home"), 800);
      })
      .catch((err) => {
        setMessage({ text: err.message, type: "error" });
        setLoading(false);
      });
  }

  return (
    <div className="auth-page" onClick={spawnRing}>
      {/* Background */}
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />
        <div className="auth-grid" />
        <div className="auth-scan-line" />
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="auth-particle"
            style={{
              left: p.left,
              top: p.top,
              "--p-dur": p.dur,
              "--p-delay": p.delay,
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div className="auth-card" ref={cardRef}>
        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-logo-icon">⚡</div>
          <span className="auth-brand-name">VIVEKX</span>
        </div>

        <h1 className="auth-heading">Welcome back</h1>
        <p className="auth-subheading">Sign in to your account to continue</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="auth-field">
            <label className="auth-field-label" htmlFor="login-email">
              Email address
            </label>
            <span className="auth-input-icon">✉️</span>
            <input
              id="login-email"
              className="auth-input with-icon"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={data.email}
              onChange={handleChange}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused("")}
              autoComplete="email"
              required
            />
          </div>

          {/* Password */}
          <div className="auth-field">
            <label className="auth-field-label" htmlFor="login-password">
              Password
            </label>
            <span className="auth-input-icon">🔒</span>
            <input
              id="login-password"
              className="auth-input with-icon"
              type={showPw ? "text" : "password"}
              name="password"
              placeholder="Your password"
              value={data.password}
              onChange={handleChange}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused("")}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="auth-pw-toggle"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "Hide password" : "Show password"}
              tabIndex={0}
            >
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Forgot link */}
          <div style={{ textAlign: "right", marginBottom: 4, marginTop: -8 }}>
            <Link className="auth-link" to="/forgot" style={{ fontSize: 12 }}>
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            id="login-submit-btn"
            type="submit"
            className={`auth-btn${loading ? " loading" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={{ fontSize: 16 }}>⟳</span> Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Message */}
        {message.text && (
          <div className={`auth-message${message.type === "error" ? " error" : " success"}`}>
            <span>{message.type === "error" ? "⚠️" : "✅"}</span>
            <span>{message.text}</span>
          </div>
        )}

        {/* Register link */}
        <div className="auth-link-row">
          <span>Don't have an account?</span>
          <Link className="auth-link" to="/register">
            Create one →
          </Link>
        </div>
      </div>
    </div>
  );
}