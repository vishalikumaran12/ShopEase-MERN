
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(response.data);
        setForm({
          name: response.data.name || "",
          email: response.data.email || "",
        });
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await api.patch("/profile", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedProfile = response.data.user || response.data;

      setProfile(updatedProfile);
      setForm({
        name: updatedProfile.name || form.name,
        email: updatedProfile.email || form.email,
      });

      const storedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      localStorage.setItem(
        "user",
        JSON.stringify({ ...storedUser, ...updatedProfile })
      );

      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container py-5">Loading profile...</div>;
  }

  return (
    <div className="container py-5" style={{ maxWidth: "650px" }}>
      <div className="bg-white border rounded-4 shadow-sm p-4 p-md-5">
        <h2 className="fw-bold mb-2">My Profile</h2>
        <p className="text-muted mb-4">
          View and update your account information.
        </p>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        {profile && (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                minLength={2}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                className="form-control"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Account Role</label>
              <input
                className="form-control"
                value={profile.role || "user"}
                disabled
              />
            </div>

            <button
              className="btn btn-primary w-100"
              type="submit"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}

        <Link to="/my-orders" className="btn btn-outline-secondary w-100 mt-3">
          View My Orders
        </Link>
      </div>
    </div>
  );
}

export default Profile;
