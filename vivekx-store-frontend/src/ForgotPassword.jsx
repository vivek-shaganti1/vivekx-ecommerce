import API_BASE_URL from "./config";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";

const PARTICLES = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  left: `${12 + i * 14}%`,
  top: `${18 + ((i * 41) % 65)}%`,
  dur: `${3.2 + (i % 2)}s`,
  delay: `${(i * 0.65) % 2.6}s`,
}));

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();
  const cardRef = useRef(null);

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
    const onLeave = () => { card.style.transform = ""; card.style.transition = "transform 0.5s ease"; };
    const p = card.parentElement;
    p.addEventListener("mousemove", onMove);
    p.addEventListener("mouseleave", onLeave);
    return () => { p.removeEventListener("mousemove", onMove); p.removeEventListener("mouseleave", onLeave); };
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    fetch(`${API_BASE_URL}/api/users/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    })
      .then(async (res) => {
        const text = await res.text();
        if (!res.ok) throw new Error("Email not found. Please check and try again.");
        return text;
      })
      .then(() => {
        setSent(true);
        setTimeout(() => navigate("/reset-password"), 2500);
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
          <div className="auth-logo-icon">🔑</div>
          <span className="auth-brand-name">VIVEKX</span>
        </div>

        {/* Step indicator */}
        <div className="auth-steps">
          <div className={`auth-step ${sent ? "done" : "active"}`}>
            <div className="auth-step-dot">{sent ? "✓" : "1"}</div>
            <div className="auth-step-label">Verify</div>
          </div>
          <div className={`auth-step-connector${sent ? " done" : ""}`} />
          <div className={`auth-step ${sent ? "active" : ""}`}>
            <div className="auth-step-dot">2</div>
            <div className="auth-step-label">Reset</div>
          </div>
          <div className="auth-step-connector" />
          <div className="auth-step">
            <div className="auth-step-dot">3</div>
            <div className="auth-step-label">Done</div>
          </div>
        </div>

        {sent ? (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div className="auth-success-icon">📧</div>
            <h2 className="auth-heading" style={{ textAlign: "center" }}>Email sent!</h2>
            <p className="auth-subheading" style={{ textAlign: "center" }}>
              A reset link has been sent.<br />Redirecting to reset page…
            </p>
          </div>
        ) : (
          <>
            <h1 className="auth-heading">Forgot password?</h1>
            <p className="auth-subheading">
              Enter your registered email and we'll send you a reset link.
            </p>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <div className="auth-field">
                <label className="auth-field-label" htmlFor="forgot-email">Registered email</label>
                <span className="auth-input-icon">✉️</span>
                <input
                  id="forgot-email"
                  className="auth-input with-icon"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (message.text) setMessage({ text: "", type: "" }); }}
                  autoComplete="email"
                  required
                />
              </div>

              <button
                id="forgot-submit-btn"
                type="submit"
                className={`auth-btn${loading ? " loading" : ""}`}
                disabled={loading}
              >
                {loading ? <><span style={{ fontSize: 16 }}>⟳</span> Sending…</> : "Send Reset Link"}
              </button>
            </form>

            {message.text && (
              <div className={`auth-message${message.type === "error" ? " error" : " success"}`}>
                <span>{message.type === "error" ? "⚠️" : "✅"}</span>
                <span>{message.text}</span>
              </div>
            )}
          </>
        )}

        <div className="auth-link-row">
          <Link className="auth-link" to="/login">← Back to login</Link>
        </div>
      </div>
    </div>
  );
}