import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import axiosInstance from "../Components/axiosInstance";

function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isAuthenticated()) navigate("/");
  }, [navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const togglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const res = await axiosInstance.post("token/", {
          username: formData.username,
          password: formData.password,
        });

        // ✅ Save tokens
        localStorage.setItem("token", res.data.access);
        localStorage.setItem("refreshToken", res.data.refresh);

        toast.success("Logged in!");

        // ✅ Check for pending action
        const pendingAction = localStorage.getItem("pendingAction");
        if (pendingAction) {
          const { type, menuItemId } = JSON.parse(pendingAction);
          localStorage.removeItem("pendingAction");

          // Redirect to perform-action route
          if (type === "addToCart") {
            navigate(`/perform-action/addToCart/${menuItemId}`);
          } else if (type === "buyNow") {
            navigate(`/perform-action/buyNow/${menuItemId}`);
          } else {
            navigate("/");
          }
        } else {
          navigate("/");
        }
      } else {
        await axiosInstance.post("register/", {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });

        toast.success("Registered! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.username?.[0] ||
        err.response?.data?.email?.[0] ||
        "Something went wrong";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="bg-gray-900 shadow-2xl rounded-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-center items-center bg-red-500 text-white p-10 w-full md:w-1/2">
          <h2 className="text-4xl font-bold mb-4">
            {isLogin ? "Welcome Back" : "Join Us Today"}
          </h2>
          <p className="text-lg">
            {isLogin ? "Login to continue" : "Sign up and explore"}
          </p>
        </div>

        {/* Right Panel */}
        <div className="p-10 w-full md:w-1/2 bg-gray-800 text-white">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isLogin ? "Login" : "Sign Up"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />

            {!isLogin && (
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            )}

            {/* Password Field with Show/Hide */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-gray-700 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute inset-y-0 right-3 flex items-center text-gray-300"
              >
                {showPassword ? (
                  <EyeIcon className="h-5 w-5" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 transition-colors px-4 py-2 rounded-lg font-semibold"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-red-400 hover:underline"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
