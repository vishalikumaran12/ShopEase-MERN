
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
} from "lucide-react";

import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../redux/cartSlice";

function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <main className="container py-5 cart-page">
      <Link to="/" className="back-link">
        <ArrowLeft size={17} /> Continue shopping
      </Link>

      <div className="cart-heading mt-4 mb-4">
        <div>
          <span className="eyebrow">YOUR BAG</span>
          <h1>Shopping cart</h1>
          <p>Review your items before checkout.</p>
        </div>

        <span className="product-count">
          {items.reduce((total, item) => total + item.quantity, 0)} items
        </span>
      </div>

      {items.length === 0 ? (
        <div className="cart-empty">
          <div className="empty-cart-icon">
            <ShoppingBag size={38} />
          </div>
          <h3>Your cart is waiting for something lovely</h3>
          <p>Explore our collection and add your favourites.</p>
          <Link to="/" className="btn shop-primary">
            Explore products
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="cart-items-panel">
              {items.map((item) => (
                <div className="cart-item" key={item._id}>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-image"
                    />
                  ) : (
                    <div className="cart-item-placeholder">
                      <ShoppingBag size={25} />
                    </div>
                  )}

                  <div className="cart-item-details">
                    <span className="category-label">{item.category}</span>
                    <h3>{item.name}</h3>
                    <p>₹{Number(item.price).toLocaleString("en-IN")}</p>

                    <div className="quantity-control">
                      <button
                        aria-label="Decrease quantity"
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          dispatch(decreaseQuantity(item._id))
                        }
                      >
                        <Minus size={15} />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        aria-label="Increase quantity"
                        disabled={item.quantity >= item.stock}
                        onClick={() =>
                          dispatch(increaseQuantity(item._id))
                        }
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-end">
                    <strong>
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </strong>

                    <button
                      className="remove-button"
                      onClick={() =>
                        dispatch(removeFromCart(item._id))
                      }
                    >
                      <Trash2 size={17} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="order-summary">
              <h3>Order summary</h3>

              <div className="summary-line">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              <div className="summary-line">
                <span>Shipping</span>
                <span className="free-shipping">Calculated at checkout</span>
              </div>

              <div className="summary-total">
                <span>Total before shipping</span>
                <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
              </div>

              <Link
                to="/checkout"
                className="btn shop-primary checkout-button"
              >
                Continue to checkout
              </Link>

              <p className="summary-note">
                Your final total will be confirmed before placing your order.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Cart;
