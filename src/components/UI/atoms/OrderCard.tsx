import type { Order } from "../../../types/order";
import { formatDisplayDate } from "../../../utils/date";
import { Link } from "react-router-dom";

type Props = {
  order: Order;
};

export default function OrderCard({ order }: Props) {
  const totalPrice =
    Number(order.total_amount) ||
    order.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const canCompletePayment =
    order.payment_status !== "paid" &&
    order.payment_status !== "refunded" &&
    order.status !== "cancelled";

  return (
    <article className="surface p-5">
      <div className="mb-4 flex flex-col gap-1 border-b border-stone-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-stone-950">Order #{order.id}</p>
          <p className="text-sm text-stone-500">
            {formatDisplayDate(order.order_date)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm sm:justify-end">
          <span className="rounded-full bg-secondary px-3 py-1 font-semibold text-primarydark">
            {order.status}
          </span>
          <span
            className={`rounded-full px-3 py-1 font-semibold ${
              canCompletePayment
                ? "bg-red-50 text-red-700"
                : "bg-stone-100 text-stone-700"
            }`}
          >
            {order.payment_status}
          </span>
          <span className="font-bold text-primary">$ {totalPrice.toFixed(2)}</span>
          {canCompletePayment && (
            <Link to={`/payment/${order.id}`} className="btn-primary h-9 px-4">
              Complete payment
            </Link>
          )}
        </div>
      </div>

      {order.items.length === 0 ? (
        <p className="text-sm text-stone-400">No items in this order</p>
      ) : (
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <img
                src={item.product.imageUrl}
                alt={item.product.title}
                className="h-24 w-16 rounded-md border border-stone-200 object-cover"
              />
              <div>
                <p className="font-semibold text-stone-900">{item.product.title}</p>
                <p className="text-sm text-stone-600">
                  Quantity: {item.quantity}
                </p>
       
                <p className="text-sm text-stone-600">
                  Price: $ {(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
            
          ))}
        </div>
        
      )}
      <div className="mt-5 border-t border-stone-200 pt-4 text-sm text-stone-600">
        Address: <span className="font-medium text-stone-800">{order.user.address || "Not provided"}</span>
      </div>
    </article>
  );
}
