import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    const authRoutes = ["/token/", "/register/"];
    const isAuthRoute = authRoutes.some((route) => config.url.includes(route));
    if (token && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor – Handles Auto Refresh on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem("refreshToken");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      refreshToken
    ) {
      originalRequest._retry = true;

      try {
        const refreshUrl = `${import.meta.env.VITE_API_URL}/token/refresh/`;
        const res = await axios.post(refreshUrl, {
          refresh: refreshToken,
        });

        // Save new access token
        localStorage.setItem("token", res.data.access);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        // Refresh token expired or invalid
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
