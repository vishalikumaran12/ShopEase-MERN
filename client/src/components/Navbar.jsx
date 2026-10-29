
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Store,
  Search,
  ShoppingCart,
  UserRound,
  Package,
  LogOut,
  ChevronDown,
  User,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../redux/cartSlice";

function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);

  const cartQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  const handleLogout = () => {
    // Clear cart from Redux and Redux Persist
    dispatch(clearCart());

    // Remove logged-in user information
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Close profile menu and redirect to login
    setProfileOpen(false);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
      <div className="container py-2">
        <Link to="/" className="navbar-brand shop-logo">
          <span className="logo-icon">
            <Store size={22} />
          </span>
          ShopEase
        </Link>

        <div className="d-flex align-items-center gap-3 ms-auto">
          <Link to="/" className="nav-link d-none d-md-block">
            Home
          </Link>

          <Link to="/" className="nav-link d-none d-md-block">
            Products
          </Link>

          <button
            className="icon-button"
            aria-label="Search products"
            onClick={() =>
              document.getElementById("product-search")?.focus()
            }
          >
            <Search size={20} />
          </button>

          <Link
            to="/cart"
            className="icon-button position-relative"
            aria-label={`Shopping cart, ${cartQuantity} items`}
          >
            <ShoppingCart size={20} />

            {cartQuantity > 0 && (
              <span className="cart-count">{cartQuantity}</span>
            )}
          </Link>

          <div className="position-relative">
            <button
              className="profile-button d-flex align-items-center gap-1"
              aria-label="Open profile menu"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((open) => !open)}
            >
              <UserRound size={20} />
              <ChevronDown size={14} />
            </button>

            {profileOpen && (
              <div
                className="position-absolute end-0 mt-2 bg-white border rounded-3 shadow p-2"
                style={{ width: "220px", zIndex: 1050 }}
              >
                <div className="px-3 py-2 border-bottom mb-2">
                  <div className="fw-semibold">
                    {user?.name || "Welcome!"}
                  </div>

                  <small className="text-muted">
                    {user?.email || "Guest user"}
                  </small>
                </div>

                {token ? (
                  <>
                    <Link
                      to="/profile"
                      className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2"
                      onClick={() => setProfileOpen(false)}
                    >
                      <User size={17} />
                      My Profile
                    </Link>

                    <Link
                      to="/my-orders"
                      className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Package size={17} />
                      My Orders
                    </Link>

                    <button
                      type="button"
                      className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2 text-danger"
                      onClick={handleLogout}
                    >
                      <LogOut size={17} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="dropdown-item rounded-2 py-2"
                      onClick={() => setProfileOpen(false)}
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      className="dropdown-item rounded-2 py-2"
                      onClick={() => setProfileOpen(false)}
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
