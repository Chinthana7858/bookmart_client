import { useEffect, useState } from "react";
import axios from "axios";
import API from "../../const/api_paths";
import type { Order } from "../../types/order";
import Navbar from "../templates/Navbar";
import OrderCard from "../UI/atoms/OrderCard";
import { useAuth } from "../../AuthContext";
import LoadingSpinner from "../UI/atoms/LoadingSpinner";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(API.GET_ORDERS_BY_USER(user?.id ?? 0), {
          withCredentials: true,
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchOrders();
  }, [user]);

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto p-6 min-h-screen">
        <h1 className="text-2xl font-bold mb-6 text-primary">Your Orders</h1>
        {loading ? <LoadingSpinner />:
        <>
        {orders.length === 0 ? (
          <p className="text-gray-600">You haven’t placed any orders yet.</p>
        ) : (
          <div className="space-y-6">
            {[...orders]
              .sort(
                (a, b) =>
                  new Date(b.order_date).getTime() -
                  new Date(a.order_date).getTime()
              )
              .map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
          </div>
        )}
        </>
        }

        
      </div>
    </>
  );
}
