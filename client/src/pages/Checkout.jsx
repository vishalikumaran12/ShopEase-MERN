
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, MapPin, ShoppingBag, ShieldCheck } from "lucide-react";

import api from "../services/api";
import { clearCart } from "../redux/cartSlice";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector((state) => state.cart.items);

  const [shippingAddress, setShippingAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!shippingAddress.trim()) {
      setError("Please enter your delivery address.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in before placing your order.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/orders",
        {
          items: items.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
          })),
          shippingAddress: shippingAddress.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(clearCart());

      navigate("/order-success", {
        state: { order: response.data.order },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to place your order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="container py-5">
        <div className="cart-empty">
          <ShoppingBag size={40} />
          <h3>Your cart is empty</h3>
          <p>Add some products before checking out.</p>
          <Link to="/" className="btn shop-primary">
            Explore products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-5 checkout-page">
      <Link to="/cart" className="back-link">
        <ArrowLeft size={17} /> Back to cart
      </Link>

      <div className="checkout-heading mt-4 mb-4">
        <span className="eyebrow">ALMOST YOURS</span>
        <h1>Checkout</h1>
        <p>Just a few details before your order is placed.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <form className="checkout-panel" onSubmit={handlePlaceOrder}>
            <div className="checkout-section-title">
              <span className="checkout-icon">
                <MapPin size={21} />
              </span>
              <div>
                <h2>Delivery address</h2>
                <p>Where should we deliver your order?</p>
              </div>
            </div>

            <label htmlFor="shippingAddress" className="checkout-label">
              Full delivery address
            </label>

            <textarea
              id="shippingAddress"
              className="form-control address-input"
              placeholder="Enter house number, street, area, city, state and PIN code"
              rows={5}
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              required
            />

            {error && (
              <div className="alert alert-danger mt-3 mb-0">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn shop-primary place-order-button"
              disabled={loading}
            >
              {loading ? "Placing your order..." : "Place order"}
            </button>

            <p className="checkout-security">
              <ShieldCheck size={17} />
              Your order will be saved securely to your account.
            </p>
          </form>
        </div>

        <div className="col-lg-5">
          <div className="checkout-panel">
            <h2 className="order-review-title">Order summary</h2>

            {items.map((item) => (
              <div className="checkout-product" key={item._id}>
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="checkout-product-placeholder">
                    <ShoppingBag size={23} />
                  </div>
                )}

                <div className="checkout-product-details">
                  <h3>{item.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                </div>

                <strong>
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </strong>
              </div>
            ))}

            <div className="summary-total">
              <span>Total before shipping</span>
              <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
            </div>

            <p className="checkout-disclaimer">
              Final prices are verified by the server when the order is placed.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Checkout;
