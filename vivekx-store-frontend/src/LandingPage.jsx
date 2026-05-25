import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage({ theme }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animRef = useRef(null);
  const particlesRef = useRef([]);
  const navigate = useNavigate();
  const [glitching, setGlitching] = useState(false);

  /* ── Glitch tick ── */
  useEffect(() => {
    const id = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 160);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  /* ── Particle colors per theme ── */
  const particleColor = () => {

    if (theme === "light")
      return "rgba(255,180,0,";     // gold

    if (theme === "panther")
      return "rgba(157,111,255,";   // purple

    return "rgba(255,42,42,";       // red (dark theme)

  };

  /* ── Canvas particle engine ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const COUNT = Math.min(150, Math.floor((W * H) / 6000));

    /* Build particles */
    particlesRef.current = Array.from({ length: COUNT }, () => {
      const ox = Math.random() * W;
      const oy = Math.random() * H;
      return {
        ox, oy,          // home position
        x: ox, y: oy,
        vx: 0, vy: 0,
        r: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.6 + 0.2,
      };
    });

    const REPEL = 120;        // mouse repel radius
    const REPEL_FORCE = 4.5;
    const RETURN = 0.045;     // spring back strength

    function tick() {
      ctx.clearRect(0, 0, W, H);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const col = particleColor();

      particlesRef.current.forEach(p => {
        /* Repel from mouse */
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < REPEL && dist > 0) {
          const force = (REPEL - dist) / REPEL;
          p.vx += (dx / dist) * force * REPEL_FORCE;
          p.vy += (dy / dist) * force * REPEL_FORCE;
        }

        /* Spring back to origin */
        p.vx += (p.ox - p.x) * RETURN;
        p.vy += (p.oy - p.y) * RETURN;

        /* Damping */
        p.vx *= 0.82;
        p.vy *= 0.82;

        p.x += p.vx;
        p.y += p.vy;

        /* Draw */
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = col + p.alpha + ")";
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(tick);
    }

    tick();

    /* Resize handler */
    function onResize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    }

    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  /* ── Mouse tracker ── */
  useEffect(() => {
    const handler = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  /* ── Nav handler ── */
  function handleEnter() {
    navigate("/login");
  }

  return (
    <div className={`lp-root lp-${theme || "dark"}`}>


      {/* PARTICLE CANVAS */}
      <canvas ref={canvasRef} className="lp-canvas" />

      {/* GRID OVERLAY */}
      <div className="lp-grid" />

      {/* TOP BAR */}
      <header className="lp-topbar">
        <div className="lp-top-left">
          <span className="lp-label">EST. 2026</span>
          <span className="lp-version">VIVEKX_COLLECTIONS</span>
        </div>

        <nav className="lp-topnav">
          <span>LUXURY</span>
          <span>COLLECTION</span>
          <span className="lp-nav-ethics">
            PREMIUM <i className="lp-box-icon" />
          </span>
        </nav>
      </header>

      {/* HERO */}
      <main className="lp-hero">

        {/* System status */}
        <div className="lp-status-text">
          EXCLUSIVE COLLECTION LOADING
        </div>

        {/* Title */}
        <div className="lp-title-block">
          <h1 className="lp-title-solid">VIVEKX</h1>
          <h1 className="lp-title-outline">STORE</h1>
        </div>

        {/* CTA */}
        <button
          className="lp-cta"
          onClick={handleEnter}
        >
          ENTER STORE
        </button>

      </main>

      {/* BOTTOM */}
      <div className="lp-bottom-content">

        <div className="lp-bottom-left">
          <div className="lp-mission-line" />

          <p>
            PREMIUM FASHION

            <br />
            SMART WEARABLES

            <br />
            EXCLUSIVE DROPS.
          </p>

        </div>

        <footer className="lp-bottom-right">

          <div className="lp-stat">
            <span className="lp-stat-label">QUALITY</span>
            <span className="lp-stat-value">100%</span>
          </div>

          <div className="lp-stat">
            <span className="lp-stat-label">AUTHENTIC</span>
            <span className="lp-stat-value">100%</span>
          </div>

        </footer>
      </div>

      {/* PREMIUM THEME SWITCHER */}
      <div className="lp-theme-switcher">
        {["dark", "light", "panther"].map((t) => (
          <button
            key={t}
            className={`lp-theme-btn ${theme === t ? "active" : ""}`}
            onClick={() => {
              localStorage.setItem("theme", t);
              window.location.reload();
            }}
          >
            {t}
          </button>
        ))}
      </div>


    </div>
  );
}
