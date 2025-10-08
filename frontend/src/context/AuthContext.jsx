import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if token exists in localStorage on app load
    const token = localStorage.getItem("token");
    if (token) setUser({ token });
  }, []);

  // Login function
  const login = (token) => {
    localStorage.setItem("token", token);
    setUser({ token });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
