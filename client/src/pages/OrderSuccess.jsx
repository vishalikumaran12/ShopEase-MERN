
import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, Package } from "lucide-react";

function OrderSuccess() {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <main className="container py-5">
      <div className="cart-empty order-success">
        <div className="success-icon">
          <CheckCircle2 size={45} />
        </div>

        <span className="eyebrow">ORDER CONFIRMED</span>
        <h1>Thank you for your order!</h1>

        <p>
          Your order has been placed successfully.
        </p>

        {order && (
          <div className="success-order-details">
            <p>
              <Package size={17} /> Order ID: {order._id}
            </p>
            <h3>
              Total: ₹{Number(order.totalAmount).toLocaleString("en-IN")}
            </h3>
            <p>Status: {order.status}</p>
          </div>
        )}

        <Link to="/" className="btn shop-primary">
          Continue shopping
        </Link>
      </div>
    </main>
  );
}

export default OrderSuccess;
