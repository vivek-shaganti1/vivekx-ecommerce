import API_BASE_URL from "./config";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import { Trash2 } from "lucide-react";
import "./collectibles.css";
function Products() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [collectibleOnly, setCollectibleOnly] = useState(false);

  <button
    onClick={() =>
      setCollectibleOnly(!collectibleOnly)
    }
  >
    Collectibles Only
  </button>


  const filteredProducts = collectibleOnly
    ? products.filter(p => p.collectible)
    : products;
  useEffect(() => {

    fetch(`${API_BASE_URL}/api/products`)

      .then(res => res.json())

      .then(data => {


        const updated = data.filter(p => p.slug);

        setProducts(updated);
        setLoading(false);

      })

      .catch(() => setLoading(false));

  }, []);

  const filtered =
    filter === "all"
      ? products
      : products.filter(p =>
        p.category?.toLowerCase().includes(filter) ||
        p.slug?.toLowerCase().includes(filter) ||
        p.name?.toLowerCase().includes(filter)
      );
  const finalProducts = collectibleOnly
    ? filtered.filter(p => p.collectible)
    : filtered;
  if (loading) return <div className="admin-loading"><div className="pd-spinner" /></div>;
  const user = JSON.parse(localStorage.getItem("user"));

  function deleteProduct(id) {

    if (!window.confirm("Delete this product?")) return;

    fetch(`${API_BASE_URL}/api/products/${id}`, {

      method: "DELETE",

      headers: {
        Authorization: `Bearer ${user.token}`
      }

    })
      .then(() => {

        // remove product from UI instantly
        setProducts(products.filter(p => p.id !== id));

      });

  }
  return (
    <div className="products-page-lux animate-in">
      {/* HEADER SECTION */}
      <div className="products-hero">
        <h1 className="ultra-title">THE <span className="gold-text">VIVEKX</span> VAULT</h1>
        <p className="vault-subtitle">Explore our most exclusive pieces, curated for the modern connoisseur.</p>

        {/* FILTER BAR */}
        <div className="filter-bar-lux glass">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>View All</button>
          <button className={filter === 'chrono' ? 'active' : ''} onClick={() => setFilter('chrono')}>Timepieces</button>
          <button
            className={filter === 'clothing' ? 'active' : ''}
            onClick={() => setFilter('clothing')}
          >
            Apparel
          </button>
          <button
            className={collectibleOnly ? "active" : ""}
            onClick={() => setCollectibleOnly(!collectibleOnly)}
          >
            Collectibles
          </button>
          <div className="search-wrap-mini">
            <input
              type="text"
              placeholder="Search collection..."
              onChange={(e) => setFilter(e.target.value.toLowerCase())}
            />
          </div>
        </div>
      </div>

      {/* PRODUCTS GALLERY */}
      <div className="gallery-grid">

        {finalProducts.map((product) => (

          <div
            key={product.id}
            className={`
    lux-gallery-card glass
    ${product.collectible ? "rarity-" + product.rarityLevel : ""}
  `}
            style={{ position: "relative" }}
          >
            {/* ADMIN BUTTONS (OUTSIDE LINK) */}
            {user?.role === "ADMIN" && (

              <div className="admin-btns">

                {/* DELETE */}
                <button
                  className="delete-btn-red"
                  onClick={(e) => {

                    e.preventDefault();
                    e.stopPropagation();

                    deleteProduct(product.id);

                  }}
                >
                  <Trash2 size={18} />
                </button>

                {/* EDIT */}
                <Link
                  to={`/edit/${product.id}`}
                  className="edit-btn"
                  onClick={(e) => e.stopPropagation()}
                >

                  ✏️

                </Link>

              </div>

            )}

            {/* PRODUCT LINK */}
            <Link to={`/product/${product.slug}`}>

              <div className="card-media">
                {product.collectible && (

                  <div className="collectible-badge">

                    COLLECTIBLE

                  </div>

                )}
                <img
                  src={
                    typeof product.images?.[0] === "object"
                      ? product.images[0].image
                      : product.images?.[0] || product.imageUrl
                  }
                  alt={product.name}
                  className="product-img"
                />

                {/* second image */}

                {product.images?.[1] && (

                  <img
                    src={
                      typeof product.images[1] === "object"
                        ? product.images[1].image
                        : product.images[1]
                    }
                    alt=""
                    className="product-img hover-img"
                  />

                )}

                {/* discount badge */}

                {product.discountPrice && (

                  <div className="discount-badge">

                    {Math.round(

                      100 -

                      (product.discountPrice / product.price) * 100

                    )}% OFF

                  </div>

                )}

                {/* low stock */}

                {product.stock > 0 && product.stock <= 5 && (

                  <div className="stock-badge">

                    ONLY {product.stock} LEFT

                  </div>

                )}

                {/* out of stock */}

                {product.stock === 0 && (

                  <div className="out-badge">

                    OUT OF STOCK

                  </div>

                )}

                <div className="card-overlay">

                  <span className="btn-explore">

                    INSPECT ARCHIVE

                  </span>

                </div>

                {product.price > 30000 && (

                  <div className="elite-badge">

                    ELITE

                  </div>

                )}

              </div>

              <div className="card-description">

                <div className="name-row">
                  <h3>{product.name}</h3>
                </div>


                {/* PRICE SECTION */}

                <div className="price-wrap">

                  {product.discountPrice ? (

                    <>

                      <span className="old-price">

                        ₹{product.price.toLocaleString()}

                      </span>

                      <span className="new-price">

                        ₹{product.discountPrice.toLocaleString()}

                      </span>

                    </>

                  ) : (

                    <span className="new-price">

                      ₹{product.price.toLocaleString()}

                    </span>

                  )}

                </div>
                {product.activated && (

                  <div
                    style={{
                      color: "green",
                      fontWeight: "600",
                      marginTop: "6px"
                    }}
                  >

                    Already owned ✓

                  </div>

                )}


                {/* VARIANT PREVIEW */}

                {(product.sizes?.length > 0 || product.colors?.length > 0) && (

                  <div className="variant-preview">

                    {product.sizes?.slice(0, 4).map(s => (
                      <span
                        key={typeof s === "object" ? s.id : s}
                        className="size-chip"
                      >
                        {typeof s === "object" ? s.size : s}
                      </span>
                    ))}


                    {product.colors?.slice(0, 4).map(c => (
                      <span
                        key={typeof c === "object" ? c.color : c}
                        className="color-dot"
                        style={{
                          background: typeof c === "object" ? c.color : c
                        }}
                      />
                    ))}

                  </div>

                )}

              </div>

            </Link>

          </div>

        ))}

      </div>

      {filtered.length === 0 && (
        <div className="no-matches">
          <h3>No items match your criteria.</h3>
          <button className="btn-gold-outline" onClick={() => setFilter('all')}>RESET VAULT</button>
        </div>
      )}
    </div>
  );
}

export default Products;