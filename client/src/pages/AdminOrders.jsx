
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, RefreshCw } from "lucide-react";
import api from "../services/api";

const statuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      setOrders(
        Array.isArray(data)
          ? data
          : Array.isArray(data.orders)
            ? data.orders
            : []
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (user?.role !== "admin") {
      navigate("/", { replace: true });
      return;
    }

    loadOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      setError("");
      setMessage("");

      await api.patch(
        `/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(`Order status updated to ${status}.`);
      await loadOrders();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (!token || user?.role !== "admin") {
    return null;
  }

  return (
    <main className="container py-5">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <span className="badge text-bg-primary mb-2">
            ADMIN PANEL
          </span>
          <h1 className="fw-bold mb-1">Order Management</h1>
          <p className="text-muted mb-0">
            View customer orders and manage their status.
          </p>
        </div>

        <Link to="/admin" className="btn btn-outline-secondary">
          <ArrowLeft size={17} className="me-2" />
          Back to Products
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {message && (
        <div className="alert alert-success">{message}</div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <Package size={24} className="text-primary mb-2" />
              <p className="text-muted mb-1">Total Orders</p>
              <h3 className="fw-bold mb-0">{orders.length}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <p className="text-muted mb-1">Pending Orders</p>
              <h3 className="fw-bold mb-0">
                {orders.filter((o) => o.status === "Pending").length}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <p className="text-muted mb-1">Delivered Orders</p>
              <h3 className="fw-bold mb-0">
                {orders.filter((o) => o.status === "Delivered").length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">All Customer Orders</h4>

        <button
          className="btn btn-outline-primary btn-sm"
          onClick={loadOrders}
          disabled={loading}
        >
          <RefreshCw size={15} className="me-1" />
          Refresh
        </button>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="alert alert-info">
          No orders found yet.
        </div>
      ) : (
        <div className="table-responsive bg-white rounded-4 shadow-sm">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Shipping Address</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <code>{order._id.slice(-8).toUpperCase()}</code>
                    <div className="small text-muted">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "—"}
                    </div>
                  </td>

                  <td>
                    <div className="fw-semibold">
                      {order.user?.name || "Customer"}
                    </div>
                    <small className="text-muted">
                      {order.user?.email || ""}
                    </small>
                  </td>

                  <td>
                    {(order.items || []).map((item, index) => (
                      <div key={item._id || index} className="small mb-1">
                        {item.name || item.product?.name || "Product"}
                        {" × "}
                        {item.quantity}
                      </div>
                    ))}
                  </td>

                  <td className="fw-semibold">
                    ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                  </td>

                  <td style={{ minWidth: 160 }}>
                    {order.shippingAddress || "—"}
                  </td>

                  <td>
                    <span className="badge text-bg-light border">
                      {order.status}
                    </span>
                  </td>

                  <td style={{ minWidth: 165 }}>
                    <select
                      className="form-select form-select-sm"
                      value={order.status}
                      disabled={updatingId === order._id}
                      onChange={(event) =>
                        updateStatus(order._id, event.target.value)
                      }
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    {updatingId === order._id && (
                      <small className="text-muted">
                        Updating...
                      </small>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default AdminOrders;
