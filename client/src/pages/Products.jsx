
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Heart,
  ShoppingCart,
  Sparkles,
  SlidersHorizontal,
  RefreshCw,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import api from "../services/api";
import { getRecommendations } from "../utils/recommendations";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [wishlist, setWishlist] = useState([]);

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const cartQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Fetch products from the backend.
  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/products", {
          params: {
            search: search.trim() || undefined,
            category: category || undefined,
            sort: sort || undefined,
          },
          signal: controller.signal,
        });

        const data = response.data;

        setProducts(
          Array.isArray(data)
            ? data
            : Array.isArray(data.products)
              ? data.products
              : []
        );
      } catch (err) {
        if (err.code === "ERR_CANCELED") return;

        setError(
          err.response?.data?.message ||
            "Could not load products. Please check your backend."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [search, category, sort]);

  // Build category options from the products currently loaded.
  const categories = useMemo(
    () =>
      [...new Set(products.map((product) => product.category).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b)),
    [products]
  );

  // Recommendations use category and price similarity.
  // When no product is selected, show products with the highest available
  // stock first, using price as a tie-breaker.
  const recommendedProducts = useMemo(
    () => getRecommendations(products, null, 4),
    [products]
  );

  const toggleWishlist = (id) => {
    setWishlist((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const handleAddToCart = (product) => {
    if (Number(product.stock) <= 0) return;

    dispatch(addToCart(product));
  };

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <main>
      {/* Hero section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <span className="hero-tag">
                <Sparkles size={15} /> YOUR EVERYDAY FINDS
              </span>

              <h1 className="hero-title mt-4">
                Find what you love,
                <span> every day.</span>
              </h1>

              <p className="hero-description">
                Discover thoughtful picks for your everyday life.
                Quality products, lovely finds, all in one place.
              </p>

              <button
                type="button"
                className="btn shop-primary mt-2"
                onClick={scrollToProducts}
              >
                Explore products
              </button>

              <div className="hero-note mt-4">
                <span>✦</span> Simple shopping. Better finds.
              </div>
            </div>

            <div className="col-lg-6">
              <div className="hero-art">
                <div className="hero-circle circle-one" />
                <div className="hero-circle circle-two" />

                <div className="hero-art-content">
                  <span className="hero-art-label">
                    A LITTLE SOMETHING
                  </span>

                  <h3>
                    Good things
                    <br />
                    are here.
                  </h3>

                  <div className="hero-art-icons">
                    <span><ShoppingCart size={27} /></span>
                    <span><Heart size={27} /></span>
                    <span><Sparkles size={27} /></span>
                  </div>

                  <p>Find your next favourite.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommendation section */}
      {!loading && !error && recommendedProducts.length > 0 && (
        <section className="container pt-5 pb-2">
          <div className="section-heading">
            <div>
              <span className="eyebrow">OUR PICKS</span>
              <h2>
                <Sparkles
                  size={23}
                  className="me-2 text-primary"
                  style={{ verticalAlign: "middle" }}
                />
                Recommended for You
              </h2>
              <p>
                Discover more lovely finds from our collection.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={scrollToProducts}
            >
              Explore all
            </button>
          </div>

          <div className="row g-4">
            {recommendedProducts.map((product) => (
              <div
                className="col-6 col-md-4 col-lg-3"
                key={product._id}
              >
                <article className="product-card h-100">
                  <div className="product-image-wrap">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                        loading="lazy"
                      />
                    ) : (
                      <div className="product-placeholder">
                        <ShoppingCart size={35} />
                        <span>Product image</span>
                      </div>
                    )}

                    <button
                      type="button"
                      className={`wishlist-button ${
                        wishlist.includes(product._id)
                          ? "wishlisted"
                          : ""
                      }`}
                      onClick={() => toggleWishlist(product._id)}
                      aria-label={
                        wishlist.includes(product._id)
                          ? `Remove ${product.name} from wishlist`
                          : `Add ${product.name} to wishlist`
                      }
                    >
                      <Heart
                        size={19}
                        fill={
                          wishlist.includes(product._id)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>
                  </div>

                  <div className="product-info">
                    <span className="category-label">
                      {product.category || "General"}
                    </span>

                    <h3 className="product-name">{product.name}</h3>

                    <div className="product-bottom">
                      <div>
                        <div className="product-price">
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </div>

                        <p className="stock-text">
                          {product.stock > 0
                            ? `${product.stock} in stock`
                            : "Currently unavailable"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="add-cart-button"
                      disabled={Number(product.stock) <= 0}
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart size={17} />
                      {product.stock > 0
                        ? "Add to cart"
                        : "Out of stock"}
                    </button>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main product collection */}
      <section className="container py-5" id="products">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE COLLECTION</span>
            <h2>Explore our products</h2>
            <p>Little things that make everyday better.</p>
          </div>

          <span className="product-count">
            {loading ? "Loading..." : `${products.length} products`}
          </span>
        </div>

        {/* Search, category and sorting */}
        <div className="filter-panel">
          <div className="search-field">
            <Search size={19} />

            <input
              id="product-search"
              type="search"
              placeholder="Search your favourites..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search products"
            />
          </div>

          <div className="select-field">
            <SlidersHorizontal size={17} />

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Filter by category"
            >
              <option value="">All categories</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <select
            className="sort-select"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="Sort products"
          >
            <option value="">Sort by</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="status-message">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Finding lovely things for you...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="alert alert-danger">
            <p className="mb-2">{error}</p>

            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => {
                setSearch((current) => current);
                window.location.reload();
              }}
            >
              <RefreshCw size={15} className="me-1" />
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && products.length === 0 && (
          <div className="empty-state">
            <Search size={34} />
            <h4>No products found</h4>
            <p>Try a different search or category.</p>

            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => {
                setSearch("");
                setCategory("");
                setSort("");
              }}
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Product grid */}
        {!loading && !error && products.length > 0 && (
          <div className="row g-4">
            {products.map((product) => (
              <div
                className="col-12 col-sm-6 col-lg-4 col-xl-3"
                key={product._id}
              >
                <article className="product-card">
                  <div className="product-image-wrap">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                        loading="lazy"
                      />
                    ) : (
                      <div className="product-placeholder">
                        <ShoppingCart size={38} />
                        <span>Product image</span>
                      </div>
                    )}

                    <button
                      type="button"
                      className={`wishlist-button ${
                        wishlist.includes(product._id)
                          ? "wishlisted"
                          : ""
                      }`}
                      onClick={() => toggleWishlist(product._id)}
                      aria-label={
                        wishlist.includes(product._id)
                          ? `Remove ${product.name} from wishlist`
                          : `Add ${product.name} to wishlist`
                      }
                    >
                      <Heart
                        size={19}
                        fill={
                          wishlist.includes(product._id)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>

                    {product.stock > 0 && product.stock <= 5 && (
                      <span className="stock-badge">
                        Almost gone
                      </span>
                    )}
                  </div>

                  <div className="product-info">
                    <span className="category-label">
                      {product.category}
                    </span>

                    <h3 className="product-name">{product.name}</h3>

                    <p className="product-description">
                      {product.description}
                    </p>

                    <div className="product-bottom">
                      <div>
                        <div className="product-price">
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </div>

                        <p className="stock-text">
                          {product.stock > 0
                            ? `${product.stock} in stock`
                            : "Currently unavailable"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="add-cart-button"
                      disabled={Number(product.stock) <= 0}
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart size={17} />
                      {product.stock > 0
                        ? "Add to cart"
                        : "Out of stock"}
                    </button>
                  </div>
                </article>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="shop-footer">
        <div className="container">
          <span className="shop-logo">ShopEase</span>
          <span>Thoughtful finds for everyday living.</span>
        </div>
      </footer>
    </main>
  );
}

export default Products;
