import type { Order } from "../../../types/order";

type Props = {
  order: Order;
};

export default function OrderCard({ order }: Props) {
  let totalPrice = 0;
     for (const item of order.items) {
    totalPrice += item.product.price * item.quantity;
  }
  return (
    <div className="border border-gray-200 p-4 rounded shadow-sm bg-white hover:scale-105">
      <div className="text-sm text-gray-500 mb-3">
       {new Date(order.order_date).toLocaleString()}
      </div>

      {order.items.length === 0 ? (
        <p className="text-sm text-gray-400">No items in this order</p>
      ) : (
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4">
              <img
                src={item.product.imageUrl}
                alt={item.product.title}
                className="w-16 h-24 object-cover rounded border"
              />
              <div>
                <p className="font-semibold text-gray-800">{item.product.title}</p>
                <p className="text-sm text-gray-600">
                  Quantity: {item.quantity}
                </p>
       
                <p className="text-sm text-gray-600">
                  Price: $. {(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
            
          ))}
        </div>
        
      )}
            <div className="flex justify-between items-end mt-6">
  <div className="text-sm text-gray-600">
    Address: <span className="font-medium">{order.user.address}</span>
  </div>
  <div className="text-sm font-bold text-primary">
    Total: $. {totalPrice.toFixed(2)}
  </div>
</div>

    </div>
  );
}
