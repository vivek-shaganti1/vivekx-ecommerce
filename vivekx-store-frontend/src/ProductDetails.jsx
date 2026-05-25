import API_BASE_URL from "./config";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import "./App.css";

const HIGHLIGHTS = [
  { icon: "✦", label: "Premium Quality", sub: "Crafted with precision materials" },
  { icon: "⟳", label: "Easy Returns", sub: "30-day hassle-free return policy" },
  { icon: "⚡", label: "Fast Delivery", sub: "Ships within 2-4 business days" },
  { icon: "🔒", label: "Secure Checkout", sub: "256-bit SSL encryption" },
];

const STAR_RATING = 4.5;

/* ---------- rating stars ---------- */
function StarRating({ rating }) {

  return (

    <div className="pd-stars">

      {[1, 2, 3, 4, 5].map(i => (

        <span

          key={i}

          className={`pd-star ${i <= Math.floor(rating)
            ? "full"
            : i - 0.5 <= rating
              ? "half"
              : ""
            }`}

        >

          ★

        </span>

      ))}

      <span className="pd-rating-label">

        {rating} / 5

      </span>

    </div>

  );

}


/* ---------- main component ---------- */

function ProductDetails() {

  const { slug } = useParams();

  const navigate = useNavigate();


  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const [qty, setQty] = useState(1);

  const [activeImg, setActiveImg] = useState(0);

  const [zoomed, setZoomed] = useState(false);

  const [btnAnim, setBtnAnim] = useState("");

  const [toast, setToast] = useState("");


  /* activation states */
  const [code, setCode] = useState("");
  const [activationMsg, setActivationMsg] = useState("");
  const [activating, setActivating] = useState(false);

  /* ---------- load product ---------- */

  useEffect(() => {

    if (!slug) return;

    fetch(`${API_BASE_URL}/api/products/slug/${slug}`)

      .then(res => {

        if (!res.ok) throw new Error();

        return res.json();

      })

      .then(data => {

        // fallback if no images saved
        if (data.images && data.images.length > 0) {
          data.images = data.images.map(img => typeof img === "object" ? img.image : img);
        } else {
          data.images = [
            data.imageUrl ||
            "https://dummyimage.com/600x600/000/fff&text=No+Image"
          ];
        }

        setProduct(data);

        setActiveImg(0);

      })

      .catch(() => setProduct(null))

      .finally(() => setLoading(false));

  }, [slug]);


  /* ---------- toast ---------- */

  function showToast(msg) {

    setToast(msg);

    setTimeout(() => setToast(""), 2500);

  }


  /* ---------- add to cart ---------- */

  function handleAddToCart() {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.token) {

      showToast("login first");

      return;

    }

    setBtnAnim("cart");

    fetch(

      `${API_BASE_URL}/api/cart/add`,

      {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

          Authorization: `Bearer ${user.token}`

        },

        body: JSON.stringify({

          productId: product.id,

          quantity: qty

        })

      }

    )

      .then(r => {

        if (!r.ok) throw new Error();

        window.dispatchEvent(new Event("cart-updated"));

        showToast("added to cart");

      })

      .catch(() => showToast("failed"))

      .finally(() => setTimeout(() => setBtnAnim(""), 300));

  }


  /* ---------- buy now ---------- */

  function handleBuyNow() {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.token) {

      showToast("login first");

      return;

    }

    setBtnAnim("buy");

    localStorage.setItem(

      "buyNowItem",

      JSON.stringify({

        product,

        quantity: 1

      })

    );

    setTimeout(() => navigate("/checkout"), 300);

  }
  /* ---------- activate product ---------- */

  async function activateProduct() {

    if (!code) {

      setActivationMsg("enter product code");
      return;

    }

    try {

      setActivating(true);

      const res = await fetch(

        `${API_BASE_URL}/api/ownership/activate?code=${code}&userId=1`,

        {
          method: "POST"
        }

      );

      const text = await res.text();

      setActivationMsg(text);

      /* reload product */

      const updated = await fetch(

        `${API_BASE_URL}/api/products/slug/${slug}`

      );

      const updatedProduct = await updated.json();

      setProduct(updatedProduct);

    }

    catch {

      setActivationMsg("activation failed");

    }

    setActivating(false);

  }

  /* ---------- loading ---------- */

  if (loading)

    return (

      <div className="pd-loading">

        <div className="pd-spinner" />

      </div>

    );


  if (!product)

    return (

      <div className="pd-not-found">

        Product not found

      </div>

    );


  /* ---------- UI ---------- */

  return (

    <div className="pd-page">

      {toast && <div className="pd-toast">{toast}</div>}


      <div className="pd-container">


        {/* breadcrumb */}

        <nav className="pd-breadcrumb">
          <Link to="/home">home</Link>
          <span className="sep">/</span>
          <Link to="/products">products</Link>
          <span className="sep">/</span>
          <span className="curr">{product.name}</span>
        </nav>


        <div className="pd-main-grid">


          <div className="pd-imagery-column">
            <div className="pd-image-container">
              <div className="pd-glass-plate"></div>
              <div
                className={`pd-main-image ${zoomed ? "zoomed" : ""}`}
                onClick={() => setZoomed(!zoomed)}
              >
                <img
                  src={product.images[activeImg]}
                  alt={product.name}
                  onError={e => {
                    e.target.src =
                      "https://dummyimage.com/600x600/000/fff&text=No+Image";
                  }}
                />
              </div>
            </div>

            {/* thumbnails */}
            <div className="pd-thumbnails">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  className={`pd-thumb ${activeImg === i ? "active" : ""}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img} alt="thumb" />
                </button>
              ))}
            </div>
          </div>


          {/* info section */}

          <div className="pd-info-panel">


            <span className="pd-badge">

              premium

            </span>


            <h1 className="pd-name">

              {product.name}

            </h1>


            <StarRating rating={STAR_RATING} />


            <div className="pd-price-row">

              <span className="pd-price">

                ₹{product.price.toLocaleString()}

              </span>

            </div>


            <p className="pd-desc">

              {product.description || "premium product"}

            </p>


            {/* qty */}

            <div className="pd-qty-section">

              <button

                onClick={() => setQty(q => Math.max(1, q - 1))}

              >

                <Minus size={20} strokeWidth={3} />

              </button>


              <span className="qty-value">{qty}</span>


              <button

                onClick={() => setQty(q => q + 1)}

              >

                <Plus size={20} strokeWidth={3} />

              </button>

            </div>


            {/* buttons */}

            <div className="pd-actions">

              <button

                className={`pd-btn-cart ${btnAnim === "cart" ? "clicked" : ""}`}

                onClick={handleAddToCart}

              >

                add to cart

              </button>


              <button

                className={`pd-btn-buy ${btnAnim === "buy" ? "clicked" : ""}`}

                onClick={handleBuyNow}

              >

                buy now

              </button>

            </div>


            {/* highlights */}
            {/* activation UI */}

            {product.collectible && (

              <div className="activation-box">

                <h3>
                  verify authentic product
                </h3>

                {product.activated ? (

                  <div className="owned-badge">
                    OWNED ✓
                  </div>

                ) : (

                  <>

                    <input

                      placeholder="enter product code"

                      value={code}

                      onChange={(e) => setCode(e.target.value)}

                      className="activation-input"

                    />


                    <button

                      onClick={activateProduct}

                      disabled={activating}

                      className="activation-btn"

                    >

                      {activating ? "verifying..." : "activate"}

                    </button>


                    {activationMsg && (

                      <p className="activation-msg">

                        {activationMsg}

                      </p>

                    )}

                  </>

                )}

              </div>

            )}
            <div className="pd-highlights">

              {HIGHLIGHTS.map(h => (

                <div key={h.label}>

                  {h.icon} {h.label}

                </div>

              ))}

            </div>


          </div>


        </div>


      </div>


    </div>

  );

}


export default ProductDetails;