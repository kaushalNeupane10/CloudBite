import { useEffect, useState } from "react";
import axios from "axios";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/orders/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-6">
          Order History
        </h2>
        {orders.length === 0 ? (
          <p className="text-center text-gray-500">You have no past orders.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border-b pb-4 flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold">Order #{order.id}</p>
                  <span
                    className={`text-sm font-medium ${
                      order.is_paid ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {order.is_paid ? "Success" : "Canceled"}
                  </span>
                </div>
                <p className="text-gray-600">
                  Date: {new Date(order.ordered_at).toLocaleString()}
                </p>
                <p className="text-gray-800 font-bold">
                  Total: ${parseFloat(order.total_price).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
