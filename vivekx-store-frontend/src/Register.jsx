import API_BASE_URL from "./config";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";

const PARTICLES = Array.from({ length: 7 }, (_, i) => ({
  id: i,
  left: `${8 + i * 13}%`,
  top: `${20 + ((i * 43) % 60)}%`,
  dur: `${3 + (i % 3)}s`,
  delay: `${(i * 0.7) % 2.5}s`,
}));

export default function Register() {
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const cardRef = useRef(null);

  /* card tilt */
  useEffect(() => {
    const card = cardRef.current;
    if (!card || window.innerWidth < 768) return;
    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(900px) rotateY(${dx * 4}deg) rotateX(${-dy * 3}deg)`;
    };
    const onLeave = () => {
      card.style.transform = "";
      card.style.transition = "transform 0.5s ease";
    };
    const p = card.parentElement;
    p.addEventListener("mousemove", onMove);
    p.addEventListener("mouseleave", onLeave);
    return () => { p.removeEventListener("mousemove", onMove); p.removeEventListener("mouseleave", onLeave); };
  }, []);

  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
    if (message.text) setMessage({ text: "", type: "" });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      }),
    })
      .then(async (res) => {
        const text = await res.text();
        let json;
        try { json = JSON.parse(text); } catch {
          throw new Error("Server returned an unexpected response.");
        }
        if (!res.ok || json.success === false)
          throw new Error(json.message || "Registration failed");
        return json;
      })
      .then(() => {
        setSuccess(true);
        setData({ name: "", email: "", password: "" });
        setTimeout(() => navigate("/login"), 300);
      })
      .catch((err) => {
        setMessage({ text: err.message, type: "error" });
        setLoading(false);
      });
  }

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />
        <div className="auth-grid" />
        <div className="auth-scan-line" />
        {PARTICLES.map((p) => (
          <div key={p.id} className="auth-particle" style={{ left: p.left, top: p.top, "--p-dur": p.dur, "--p-delay": p.delay }} />
        ))}
      </div>

      <div className="auth-card" ref={cardRef}>
        <div className="auth-brand">
          <div className="auth-logo-icon">🌟</div>
          <span className="auth-brand-name">VIVEKX</span>
        </div>

        {success ? (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div className="auth-success-icon">✅</div>
            <h2 className="auth-heading" style={{ textAlign: "center" }}>You're in!</h2>
            <p className="auth-subheading" style={{ textAlign: "center" }}>
              Account created successfully.<br />Redirecting to login…
            </p>
          </div>
        ) : (
          <>
            <h1 className="auth-heading">Create account</h1>
            <p className="auth-subheading">Join VIVEKX Collections — premium drops await</p>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <div className="auth-field">
                <label className="auth-field-label" htmlFor="reg-name">Full name</label>
                <span className="auth-input-icon">👤</span>
                <input
                  id="reg-name"
                  className="auth-input with-icon"
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={data.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="auth-field">
                <label className="auth-field-label" htmlFor="reg-email">Email address</label>
                <span className="auth-input-icon">✉️</span>
                <input
                  id="reg-email"
                  className="auth-input with-icon"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={data.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="auth-field">
                <label className="auth-field-label" htmlFor="reg-password">Password</label>
                <span className="auth-input-icon">🔒</span>
                <input
                  id="reg-password"
                  className="auth-input with-icon"
                  type={showPw ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  value={data.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="auth-pw-toggle"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>

              <button
                id="register-submit-btn"
                type="submit"
                className={`auth-btn${loading ? " loading" : ""}`}
                disabled={loading}
              >
                {loading ? <><span style={{ fontSize: 16 }}>⟳</span> Creating account…</> : "Create Account"}
              </button>
            </form>

            {message.text && (
              <div className={`auth-message${message.type === "error" ? " error" : " success"}`}>
                <span>{message.type === "error" ? "⚠️" : "✅"}</span>
                <span>{message.text}</span>
              </div>
            )}

            <div className="auth-link-row">
              <span>Already have an account?</span>
              <Link className="auth-link" to="/login">Sign in →</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}