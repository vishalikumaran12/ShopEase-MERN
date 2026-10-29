
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingBag, ArrowLeft } from "lucide-react";
import api from "../services/api";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/orders/my-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load your orders. Please log in again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <main className="container py-5 my-orders-page">
      <Link to="/" className="back-link">
        <ArrowLeft size={17} /> Continue shopping
      </Link>

      <div className="checkout-heading mt-4 mb-4">
        <span className="eyebrow">YOUR SHOPPING JOURNEY</span>
        <h1>My orders</h1>
        <p>All your purchases, together in one place.</p>
      </div>

      {loading && (
        <div className="status-message">
          <div className="spinner-border text-primary" />
          <p>Loading your orders...</p>
        </div>
      )}

      {!loading && error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="cart-empty">
          <ShoppingBag size={40} />
          <h3>No orders yet</h3>
          <p>Your placed orders will appear here.</p>
          <Link to="/" className="btn shop-primary">
            Explore products
          </Link>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="my-orders-list">
          {orders.map((order) => (
            <article className="my-order-card" key={order._id}>
              <div className="my-order-header">
                <div className="order-id-wrap">
                  <span className="order-icon">
                    <Package size={22} />
                  </span>
                  <div>
                    <h2>Order details</h2>
                    <p>Order ID: {order._id}</p>
                  </div>
                </div>

                <span
                  className={`order-status status-${order.status.toLowerCase()}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="my-order-meta">
                <div>
                  <span>Order date</span>
                  <strong>
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </strong>
                </div>

                <div>
                  <span>Total amount</span>
                  <strong>
                    ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>

              <div className="my-order-products">
                {order.items.map((item, index) => (
                  <div
                    className="my-order-product"
                    key={item.product?._id || `${order._id}-${index}`}
                  >
                    {item.product?.image ? (
                      <img src={item.product.image} alt={item.name} />
                    ) : (
                      <div className="order-product-placeholder">
                        <ShoppingBag size={20} />
                      </div>
                    )}

                    <div>
                      <h3>{item.name}</h3>
                      <p>Quantity: {item.quantity}</p>
                    </div>

                    <strong>
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="my-order-address">
                <span>Delivery address</span>
                <p>{order.shippingAddress}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default MyOrders;
