import { useEffect, useRef } from "react";
import "./App.css";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function Home() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const handler = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const heroSection = canvas.parentElement;
    
    let W = heroSection.offsetWidth;
    let H = heroSection.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const COUNT = Math.min(150, Math.floor((W * H) / 6000));

    particlesRef.current = Array.from({ length: COUNT }, () => {
      const ox = Math.random() * W;
      const oy = Math.random() * H;
      return {
        ox, oy,
        x: ox, y: oy,
        vx: 0, vy: 0,
        r: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.6 + 0.2,
      };
    });

    const REPEL = 120;
    const REPEL_FORCE = 4.5;
    const RETURN = 0.045;

    function tick() {
      ctx.clearRect(0, 0, W, H);
      
      const rect = canvas.getBoundingClientRect();
      const mx = mouseRef.current.x - rect.left;
      const my = mouseRef.current.y - rect.top;

      const theme = document.body.className || "dark";
      let col = "rgba(255,42,42,";
      if (theme.includes("light")) col = "rgba(255,180,0,";
      else if (theme.includes("panther")) col = "rgba(157,111,255,";

      particlesRef.current.forEach(p => {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < REPEL && dist > 0) {
          const force = (REPEL - dist) / REPEL;
          p.vx += (dx / dist) * force * REPEL_FORCE;
          p.vy += (dy / dist) * force * REPEL_FORCE;
        }

        p.vx += (p.ox - p.x) * RETURN;
        p.vy += (p.oy - p.y) * RETURN;
        p.vx *= 0.82;
        p.vy *= 0.82;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = col + p.alpha + ")";
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(tick);
    }

    tick();

    function onResize() {
      W = heroSection.offsetWidth;
      H = heroSection.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    }

    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const watches = [
    {
      title: "Chrono X",
      img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
    },
    {
      title: "Steel Edge",
      img: "https://images.unsplash.com/photo-1518544801976-3e159e50e5bb"
    },
    {
      title: "Midnight Pro",
      img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
    },
    {
      title: "Titan Luxe",
      img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d"
    }
  ];

  const shirts = [
    {
      title: "Black Core",
      img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf"
    },
    {
      title: "Crimson Fit",
      img: "https://images.unsplash.com/photo-1520975916090-3105956dac38"
    },
    {
      title: "Shadow Wear",
      img: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6"
    },
    {
      title: "Urban Prime",
      img: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4"
    }
  ];

  return (
    <>
      {/* SECOND NAVBAR WITH XP */}
      <Navbar />

      <div className="netflix-home">

        {/* HERO */}
        <section className="home-hero" style={{ position: "relative", overflow: "hidden" }}>

          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 0,
              pointerEvents: "none"
            }}
          />

          <div className="hero-content" style={{ position: "relative", zIndex: 1 }}>

            <h1 className="hero-title">
              VIVEKX <span>COLLECTION</span>
            </h1>

            <p>
              Premium watches & shirts curated with confidence
            </p>

            <button onClick={() => navigate("/products")}>
              Shop Now
            </button>

          </div>

        </section>


        {/* WATCHES */}
        <section className="row">

          <h2>Trending Watches</h2>

          <div className="row-posters">

            {watches.map((item, index) => (

              <Link
                to={`/product/${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                className="card-link"
                key={index}
              >

                <div className="poster-card product-card">

                  <img src={item.img} alt={item.title} />

                  <span>{item.title}</span>

                </div>

              </Link>

            ))}

          </div>

        </section>


        {/* SHIRTS */}
        <section className="row">

          <h2>Premium Shirts</h2>

          <div className="row-posters">

            {shirts.map((item, index) => (

              <Link
                to={`/product/${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                className="card-link"
                key={index}
              >

                <div className="poster-card shirt product-card">

                  <img src={item.img} alt={item.title} />

                  <span>{item.title}</span>

                </div>

              </Link>

            ))}

          </div>

        </section>


        <img
          src="/dark/arrow.png"
          className="side-arrow"
          alt="Decorative Arrow"
        />

      </div>

    </>

  );

}

export default Home;