
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import api from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
  });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      setProducts(
        Array.isArray(response.data)
          ? response.data
          : response.data.products || []
      );
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (user?.role !== "admin") {
      navigate("/");
      return;
    }

    loadProducts();
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      stock: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    try {
      if (editingId) {
        await api.patch(`/products/${editingId}`, payload, {
          headers: authHeaders,
        });
        setMessage("Product updated successfully!");
      } else {
        await api.post("/products", payload, {
          headers: authHeaders,
        });
        setMessage("Product added successfully!");
      }

      resetForm();
      await loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      category: product.category || "",
      image: product.image || "",
      stock: String(product.stock ?? ""),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await api.delete(`/products/${id}`, {
        headers: authHeaders,
      });
      setMessage("Product deleted successfully!");
      await loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete product.");
    }
  };

  if (!token || user?.role !== "admin") {
    return null;
  }

  return (
    <main className="container py-5">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <span className="badge text-bg-primary mb-2">ADMIN PANEL</span>
          <h1 className="fw-bold mb-1">Product Management</h1>
          <p className="text-muted mb-0">
            Add, update and manage your ShopEase products.
          </p>
        </div>

        
<div className="d-flex gap-2 flex-wrap">
  <Link to="/admin/orders" className="btn btn-primary">
    Manage Orders
  </Link>

  <Link to="/" className="btn btn-outline-secondary">
    <ArrowLeft size={17} className="me-2" />
    Back to Store
  </Link>
</div>

      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <section className="card border-0 shadow-sm rounded-4 mb-5">
        <div className="card-body p-4">
          <h4 className="fw-bold mb-4">
            {editingId ? "Edit Product" : "Add New Product"}
          </h4>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Product Name</label>
                <input
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Category</label>
                <input
                  className="form-control"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Price (₹)</label>
                <input
                  className="form-control"
                  type="number"
                  min="0"
                  step="0.01"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Stock Quantity</label>
                <input
                  className="form-control"
                  type="number"
                  min="0"
                  step="1"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">Image URL</label>
                <input
                  className="form-control"
                  type="url"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/product.jpg"
                />
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="3"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button className="btn btn-primary" disabled={saving}>
                <Plus size={17} className="me-1" />
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Product"
                    : "Add Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      <section>
        <h4 className="fw-bold mb-3">
          <Package size={22} className="me-2" />
          All Products ({products.length})
        </h4>

        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-muted">No products found.</p>
        ) : (
          <div className="table-responsive bg-white rounded-4 shadow-sm">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            style={{
                              width: 48,
                              height: 48,
                              objectFit: "cover",
                              borderRadius: 8,
                            }}
                          />
                        )}
                        <span className="fw-semibold">{product.name}</span>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>₹{Number(product.price).toLocaleString("en-IN")}</td>
                    <td>{product.stock}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEdit(product)}
                          aria-label={`Edit ${product.name}`}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(product._id)}
                          aria-label={`Delete ${product.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;
