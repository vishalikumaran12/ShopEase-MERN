
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";  
import Contact from "./pages/Contact";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/cart" element={<Cart />} /> 
        <Route path="/checkout" element={<Checkout />} />
<Route path="/order-success" element={<OrderSuccess />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/my-orders" element={<MyOrders />} />
<Route path="/profile" element={<Profile />} />
<Route path="/admin" element={<AdminDashboard />} />
<Route path="/admin/orders" element={<AdminOrders />} />
<Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
