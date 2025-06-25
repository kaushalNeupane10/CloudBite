import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.error("Payment was cancelled.");
    const timer = setTimeout(() => {
      navigate("/menu");
    }, 3000); 

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-red-100 text-red-800 text-center">
      <div>
        <h1 className="text-4xl font-bold mb-4">Payment Cancelled ❌</h1>
        <p>Redirecting back to menu...</p>
      </div>
    </div>
  );
};

export default Cancel;
