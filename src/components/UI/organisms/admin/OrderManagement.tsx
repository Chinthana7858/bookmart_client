import axios from "axios";
import { useEffect, useState } from "react";
import API from "../../../../const/api_paths";
import type { Order } from "../../../../types/order";
import OrderCard from "../../atoms/OrderCard";
import LoadingSpinner from "../../atoms/LoadingSpinner";

const PAGE_LIMIT = 10;

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalOrders / PAGE_LIMIT);

  const fetchOrders = async (page: number) => {
    setLoading(true);
    try {
      const res = await axios.get(API.GET_ORDERS_PAGINATED, {
        params: {
          skip: (page - 1) * PAGE_LIMIT,
          limit: PAGE_LIMIT,
        },
        withCredentials: true,
      });
      setOrders(res.data.orders);
      setTotalOrders(res.data.total);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  if (loading) return <div className="p-8"><LoadingSpinner /></div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-primary">All Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <>
          <div className="space-y-6">
            {orders
              .sort(
                (a, b) =>
                  new Date(b.order_date).getTime() -
                  new Date(a.order_date).getTime()
              )
              .map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
          </div>

          <div className="flex justify-between items-center mt-8">
            <button
              className="px-4 py-2 border rounded disabled:opacity-50 cursor-pointer"
              onClick={handlePrev}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>

            <button
              className="px-4 py-2 border rounded disabled:opacity-50 cursor-pointer"
              onClick={handleNext}
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
