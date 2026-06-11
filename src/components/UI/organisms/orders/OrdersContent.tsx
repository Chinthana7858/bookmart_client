import Navbar from "../../../templates/Navbar";
import OrderCard from "../../atoms/OrderCard";
import { useAuth } from "../../../../auth";
import LoadingSpinner from "../../atoms/LoadingSpinner";
import { useGetMyOrdersQuery } from "../../../../services/bookmartApi";

export default function Orders() {
  const { user } = useAuth();
  const { data: orders = [], isLoading: loading } = useGetMyOrdersQuery(undefined, {
    skip: !user?.id,
  });

  return (
    <div className="min-h-screen bg-light">
      <Navbar />

      <main className="page-container min-h-screen py-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Account
          </p>
          <h1 className="text-2xl font-bold text-stone-950">Your orders</h1>
        </div>

        {loading ? (
          <div className="py-16">
            <LoadingSpinner />
          </div>
        ) : orders.length === 0 ? (
          <div className="surface py-16 text-center text-stone-500">
            You have not placed any orders yet.
          </div>
        ) : (
          <div className="space-y-5">
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
      </main>
    </div>
  );
}
