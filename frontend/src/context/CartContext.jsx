import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../Components/axiosInstance";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Utility to update cart count
  const updateCartCount = (items) => {
    const count = items.reduce((acc, item) => acc + (item.quantity || 0), 0);
    setCartCount(count);
  };

  // Fetch cart from backend or guest cart
  const fetchCart = async () => {
    if (!user) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      setCartItems(guestCart);
      updateCartCount(guestCart);
      return;
    }
    try {
      const response = await axiosInstance.get("/cart-items/");
      setCartItems(response.data);
      updateCartCount(response.data);
    } catch (err) {
      console.error("Error fetching cart:", err.response?.data || err.message);
    }
  };

  // Add item to cart
  const addToCart = async (menuItemId, quantity = 1) => {
    if (!user) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const existing = guestCart.find((item) => item.menuItemId === menuItemId);
      if (existing) existing.quantity += quantity;
      else guestCart.push({ menuItemId, quantity });
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      setCartItems(guestCart);
      updateCartCount(guestCart);
      toast.info("Please login or signup first.");
      window.dispatchEvent(new Event("storage"));
      return;
    }

    try {
      const existing = cartItems.find((item) => item.menu_item?.id === menuItemId);
      if (existing) {
        await updateCartQuantity(menuItemId, existing.quantity + quantity);
        return;
      }
      await axiosInstance.post("/cart-items/", { menu_item_id: menuItemId, quantity });
      await fetchCart();
      toast.success("Item added to cart!");
    } catch (err) {
      console.error("Add to cart error:", err.response?.data || err.message);
      toast.error("Could not add item to cart.");
    }
  };

  // Remove item from cart
  const removeFromCart = async (menuItemId) => {
    if (!user) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const updated = guestCart.filter((item) => item.menuItemId !== menuItemId);
      localStorage.setItem("guestCart", JSON.stringify(updated));
      setCartItems(updated);
      updateCartCount(updated);
      toast.info("Item removed from cart.");
      window.dispatchEvent(new Event("storage"));
      return;
    }

    try {
      const itemToRemove = cartItems.find((item) => item.menu_item?.id === menuItemId);
      if (!itemToRemove) return;

      await axiosInstance.delete(`/cart-items/${itemToRemove.id}/`);
      const updated = cartItems.filter((i) => i.id !== itemToRemove.id);
      setCartItems(updated);
      updateCartCount(updated);
      toast.info("Item removed from cart.");
    } catch (err) {
      console.error("Remove from cart error:", err.response?.data || err.message);
    }
  };

  // Update quantity
  const updateCartQuantity = async (menuItemId, quantity) => {
    if (quantity < 1) return;

    if (!user) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const index = guestCart.findIndex((i) => i.menuItemId === menuItemId);
      if (index === -1) return;
      guestCart[index].quantity = quantity;
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      setCartItems(guestCart);
      updateCartCount(guestCart);
      window.dispatchEvent(new Event("storage"));
      return;
    }

    try {
      const item = cartItems.find((i) => i.menu_item?.id === menuItemId);
      if (!item) return;
      await axiosInstance.patch(`/cart-items/${item.id}/`, { quantity });
      const updated = cartItems.map((i) =>
        i.id === item.id ? { ...i, quantity } : i
      );
      setCartItems(updated);
      updateCartCount(updated);
    } catch (err) {
      console.error("Update quantity error:", err.response?.data || err.message);
    }
  };

  // Sync guest cart across tabs
  useEffect(() => {
    const handleStorage = () => {
      if (!user) {
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        setCartItems(guestCart);
        updateCartCount(guestCart);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
