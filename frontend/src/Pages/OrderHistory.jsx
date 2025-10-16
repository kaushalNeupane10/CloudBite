import { useEffect, useState } from "react";
import axiosInstance from "../Components/axiosInstance";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { toast } from "react-toastify";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect unauthenticated users with toast
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.info("Please login to view your order history");
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/orders/");
        const sortedOrders = res.data.sort(
          (a, b) => new Date(b.ordered_at) - new Date(a.ordered_at)
        );
        setOrders(sortedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mb-4"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-8">
          Order History
        </h2>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500">You have no past orders.</p>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-300 rounded-lg p-4 md:p-6"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                  <span
                    className={`text-sm font-medium ${
                      order.is_paid ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {order.is_paid ? "Success" : "Canceled"}
                  </span>
                  <p className="text-gray-600 mt-2 md:mt-0">
                    {new Date(order.ordered_at).toLocaleString()}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="border-b border-gray-300 pb-2 px-2">Image</th>
                        <th className="border-b border-gray-300 pb-2 px-2">Name</th>
                        <th className="border-b border-gray-300 pb-2 px-2">Quantity</th>
                        <th className="border-b border-gray-300 pb-2 px-2">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.order_items.map((item) => (
                        <tr key={item.id} className="border-b border-gray-200">
                          <td className="py-2 px-2 w-20">
                            {item.menu_item.image ? (
                              <img
                                src={item.menu_item.image}
                                alt={item.menu_item.title}
                                className="w-16 h-16 object-cover rounded"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                                No Image
                              </div>
                            )}
                          </td>
                          <td className="py-2 px-2">{item.menu_item.title}</td>
                          <td className="py-2 px-2">{item.quantity}</td>
                          <td className="py-2 px-2">
                            ${parseFloat(item.price_at_order).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="mt-4 text-right text-gray-800 font-semibold text-lg">
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
