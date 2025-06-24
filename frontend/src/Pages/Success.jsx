import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.success("Payment successful!");
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000); 

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-green-100 text-green-800 text-center">
      <div>
        <h1 className="text-4xl font-bold mb-4">Payment Successful 🎉</h1>
        <p>You will be redirected to the homepage shortly.</p>
      </div>
    </div>
  );
};

export default Success;
