// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import axiosInstance from "../Components/axiosInstance";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user info
  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/me/"); // ✅ Using axios instance
      setUser(res.data);
      return res.data;
    } catch (err) {
      console.error("Error fetching user info:", err);
      setUser(null);
      return null;
    }
  };

  // Initialize user on app start
  useEffect(() => {
    const initialize = async () => {
      const token = localStorage.getItem("token");
      const refresh = localStorage.getItem("refreshToken");

      if (token && refresh) {
        await fetchUser();
      }

      setLoading(false);
    };
    initialize();
  }, []);

  // Login handler
  const login = async ({ access, refresh }) => {
    try {
      localStorage.setItem("token", access);
      localStorage.setItem("refreshToken", refresh);

      const loggedInUser = await fetchUser();

      // Merge guest cart if exists
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      for (const item of guestCart) {
        await axiosInstance.post("/cart-items/", {
          menu_item_id: item,
          quantity: 1,
        });
      }

      if (guestCart.length > 0) {
        localStorage.removeItem("guestCart");
        toast.success("Guest cart merged!");
      }

      toast.success("Login successful!");
      return loggedInUser;
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed!");
      return null;
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
    toast.info("Logged out successfully");
    window.location.href = "/login"; // redirect to login
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
