import API_BASE_URL from "./config";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";

const PARTICLES = Array.from({ length: 7 }, (_, i) => ({
  id: i,
  left: `${9 + i * 12}%`,
  top: `${14 + ((i * 39) % 68)}%`,
  dur: `${3 + (i % 3)}s`,
  delay: `${(i * 0.6) % 2.8}s`,
}));

export default function ResetPassword() {
  const [data, setData] = useState({ email: "", password: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const cardRef = useRef(null);

  /* password strength */
  const strength = (() => {
    const pw = data.password;
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  })();
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#e55050", "#f0a030", "#4ade80", "#22c55e"][strength];

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

  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
    if (message.text) setMessage({ text: "", type: "" });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      setMessage({ text: "Passwords do not match. Please check and try again.", type: "error" });
      return;
    }
    if (data.password.length < 8) {
      setMessage({ text: "Password must be at least 8 characters.", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    fetch(`${API_BASE_URL}/api/users/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      }),
    })
      .then(async (res) => {
        const text = await res.text();
        if (!res.ok) throw new Error("Password reset failed. Please verify your email and try again.");
        return text;
      })
      .then(() => {
        setDone(true);
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
          <div className="auth-logo-icon">🛡️</div>
          <span className="auth-brand-name">VIVEKX</span>
        </div>

        {/* Step indicator — step 2 active */}
        <div className="auth-steps">
          <div className="auth-step done">
            <div className="auth-step-dot">✓</div>
            <div className="auth-step-label">Verify</div>
          </div>
          <div className="auth-step-connector done" />
          <div className={`auth-step ${done ? "done" : "active"}`}>
            <div className="auth-step-dot">{done ? "✓" : "2"}</div>
            <div className="auth-step-label">Reset</div>
          </div>
          <div className={`auth-step-connector${done ? " done" : ""}`} />
          <div className={`auth-step ${done ? "active" : ""}`}>
            <div className="auth-step-dot">{done ? "✓" : "3"}</div>
            <div className="auth-step-label">Done</div>
          </div>
        </div>

        {done ? (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div className="auth-success-icon">🎉</div>
            <h2 className="auth-heading" style={{ textAlign: "center" }}>Password reset!</h2>
            <p className="auth-subheading" style={{ textAlign: "center" }}>
              Your password has been updated successfully.<br />Redirecting to login…
            </p>
          </div>
        ) : (
          <>
            <h1 className="auth-heading">Reset password</h1>
            <p className="auth-subheading">
              Enter your email and choose a new secure password.
            </p>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="auth-field">
                <label className="auth-field-label" htmlFor="reset-email">Registered email</label>
                <span className="auth-input-icon">✉️</span>
                <input
                  id="reset-email"
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

              {/* New Password */}
              <div className="auth-field">
                <label className="auth-field-label" htmlFor="reset-password">New password</label>
                <span className="auth-input-icon">🔒</span>
                <input
                  id="reset-password"
                  className="auth-input with-icon"
                  type={showPw ? "text" : "password"}
                  name="password"
                  placeholder="Min 8 characters"
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

              {/* Password strength bar */}
              {data.password && (
                <div style={{ marginTop: -8, marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                    {[1,2,3,4].map((n) => (
                      <div
                        key={n}
                        style={{
                          flex: 1,
                          height: 3,
                          borderRadius: 2,
                          background: n <= strength ? strengthColor : "rgba(255,255,255,0.1)",
                          transition: "background 0.3s",
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: strengthColor, fontWeight: 600, letterSpacing: "0.5px" }}>
                    {strengthLabel}
                  </span>
                </div>
              )}

              {/* Confirm Password */}
              <div className="auth-field">
                <label className="auth-field-label" htmlFor="reset-confirm">Confirm password</label>
                <span className="auth-input-icon">✅</span>
                <input
                  id="reset-confirm"
                  className="auth-input with-icon"
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={data.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="auth-pw-toggle"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? "Hide confirm" : "Show confirm"}
                >
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </div>

              <button
                id="reset-submit-btn"
                type="submit"
                className={`auth-btn${loading ? " loading" : ""}`}
                disabled={loading}
              >
                {loading ? <><span style={{ fontSize: 16 }}>⟳</span> Resetting…</> : "Reset Password"}
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