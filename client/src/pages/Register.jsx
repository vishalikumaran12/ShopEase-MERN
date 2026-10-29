
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, UserRound, Store } from "lucide-react";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      setSuccess(response.data.message || "Registration successful!");

      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to register. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/" className="shop-logo auth-logo">
          <span className="logo-icon"><Store size={22} /></span>
          ShopEase
        </Link>

        <div className="auth-heading">
          <span className="eyebrow">JOIN SHOPEASE</span>
          <h1>Create your account</h1>
          <p>Sign up to enjoy a simpler shopping experience.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="auth-label" htmlFor="name">Full name</label>
          <div className="auth-input-wrap">
            <UserRound size={19} />
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          <label className="auth-label mt-3" htmlFor="register-email">Email address</label>
          <div className="auth-input-wrap">
            <Mail size={19} />
            <input
              id="register-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <label className="auth-label mt-3" htmlFor="register-password">Password</label>
          <div className="auth-input-wrap">
            <Lock size={19} />
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={6}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {success && <div className="alert alert-success mt-3">{success}</div>}

          <button
            className="btn shop-primary auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}

export default Register;
