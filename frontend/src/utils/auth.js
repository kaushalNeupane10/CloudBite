// utils/auth.js

// Decode JWT payload (without verifying signature)
export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  const payload = parseJwt(token);
  if (!payload) return false;

  const now = Date.now() / 1000; // in seconds
  return payload.exp > now;
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
