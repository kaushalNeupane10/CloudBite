import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./Pages/Menu";
import Home from "./Pages/Home";
import Contact from "./Pages/Contact";
import Mainlayout from "./Layouts/Mainlayout";
import Login from "./Pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cart from "./Pages/Cart";
import Success from "./Pages/Success";
import Cancel from "./Pages/Cancel";
import OrderHistoryPage from "./Pages/OrderHistory";

export default function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        toastClassName="bg-red-900 text-white border border-red-700 shadow-lg rounded-lg"
        bodyClassName="text-white text-sm"
        progressClassName="bg-red-500"
      />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Mainlayout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="contact" element={<Contact />} />
          <Route path="cart" element={<Cart />} />
          <Route path="success" element={<Success />} />
          <Route path="cancel" element={<Cancel />} />
          <Route path="order" element={<OrderHistoryPage />} />
        </Route>

        {/* Login page */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}
