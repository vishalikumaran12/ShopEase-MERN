
import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setErrors({ ...errors, [event.target.name]: "" });
    setSuccess("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = {};

    if (form.name.trim().length < 2) {
      newErrors.name = "Please enter your name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (form.subject.trim().length < 3) {
      newErrors.subject = "Subject must contain at least 3 characters.";
    }

    if (form.message.trim().length < 10) {
      newErrors.message = "Message must contain at least 10 characters.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSuccess(
      "Thank you for contacting ShopEase! Your form has been validated."
    );

    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setErrors({});
  };

  return (
    <main className="container py-5">
      <div className="text-center mb-5">
        <span className="badge text-bg-primary mb-2">WE'RE HERE TO HELP</span>
        <h1 className="fw-bold">Contact Us</h1>
        <p className="text-muted">
          Have a question about your order or our products? Send us a message.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="bg-white border rounded-4 shadow-sm p-4 h-100">
            <h4 className="fw-bold mb-4">Get in Touch</h4>

            <div className="d-flex gap-3 mb-4">
              <Mail className="text-primary" />
              <div>
                <h6 className="fw-semibold mb-1">Email</h6>
                <p className="text-muted mb-0">
                  Contact us through this form.
                </p>
              </div>
            </div>

            <div className="d-flex gap-3 mb-4">
              <Phone className="text-primary" />
              <div>
                <h6 className="fw-semibold mb-1">Phone</h6>
                <p className="text-muted mb-0">
                  Customer support information
                </p>
              </div>
            </div>

            <div className="d-flex gap-3">
              <MapPin className="text-primary" />
              <div>
                <h6 className="fw-semibold mb-1">Location</h6>
                <p className="text-muted mb-0">Chennai, Tamil Nadu</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="bg-white border rounded-4 shadow-sm p-4 p-md-5">
            <h4 className="fw-bold mb-4">Send a Message</h4>

            {success && (
              <div className="alert alert-success">{success}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Subject</label>
                <input
                  className={`form-control ${errors.subject ? "is-invalid" : ""}`}
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                />
                {errors.subject && (
                  <div className="invalid-feedback">{errors.subject}</div>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label">Message</label>
                <textarea
                  className={`form-control ${errors.message ? "is-invalid" : ""}`}
                  name="message"
                  rows="5"
                  value={form.message}
                  onChange={handleChange}
                  required
                />
                {errors.message && (
                  <div className="invalid-feedback">{errors.message}</div>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-100">
                <Send size={17} className="me-2" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Contact;
