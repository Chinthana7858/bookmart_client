import type { Book } from "../../../types/book";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiZap } from "react-icons/fi";
import { useAuth } from "../../../auth";
import {
  useAddToCartMutation,
  useCreateActivityMutation,
  useCreateOrderItemMutation,
  useCreateOrderMutation,
} from "../../../services/bookmartApi";

export default function BookItem({
  id,
  imageUrl,
  title,
  description,
  price,
  author,
  stock,
}: Book) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [addToCart, { isLoading: addingToCart }] = useAddToCartMutation();
  const [createOrder, { isLoading: creatingOrder }] = useCreateOrderMutation();
  const [createOrderItem, { isLoading: creatingOrderItem }] = useCreateOrderItemMutation();
  const [createActivity] = useCreateActivityMutation();
  const isBuying = creatingOrder || creatingOrderItem;

  const requireAuth = () => {
    if (user) return true;
    navigate("/signin");
    return false;
  };

  const logActivity = async (action: "buy" | "add_to_cart") => {
    try {
      await createActivity({
        user_id: user?.id,
        product_id: Number(id),
        action,
      }).unwrap();
    } catch (error) {
      console.error("Failed to log book activity", error);
    }
  };

  const handleAddToCart = async () => {
    if (!requireAuth()) return;
    try {
      await addToCart({ product_id: Number(id), quantity: 1 }).unwrap();
      logActivity("add_to_cart");
    } catch (error) {
      console.error("Failed to add book to cart", error);
      alert("Could not add this book to your cart. Please check stock and try again.");
    }
  };

  const handleBuyNow = async () => {
    if (!requireAuth()) return;
    try {
      const order = await createOrder().unwrap();
      await createOrderItem({
        order_id: order.id,
        product_id: Number(id),
        quantity: 1,
      }).unwrap();
      logActivity("buy");
      navigate(`/payment/${order.id}`);
    } catch (error) {
      console.error("Failed to start checkout", error);
      alert("Could not start checkout for this book. Please check stock and try again.");
    }
  };

  const isOutOfStock = stock <= 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-stone-300 hover:shadow-md">
      <button
        type="button"
        onClick={() => navigate(`/book/${id}`)}
        className="flex flex-1 cursor-pointer flex-col text-left"
        aria-label={`View ${title}`}
      >
        <div className="aspect-square overflow-hidden bg-stone-100">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        </div>
        <div className="flex flex-1 flex-col space-y-2 p-3">
          <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-stone-900">
            {title}
          </h3>
          <p className="line-clamp-2 min-h-10 text-xs leading-5 text-stone-500">
            {description}
          </p>
          {author && <p className="text-xs font-medium text-stone-600">By {author}</p>}
          <p className="mt-auto text-sm font-bold text-primary">$ {Number(price).toFixed(2)}</p>
        </div>
      </button>

      <div className="mt-auto grid gap-2 border-t border-stone-100 p-3">
        <button
          type="button"
          className="inline-flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-stone-200 bg-white px-2 text-xs font-semibold text-stone-700 shadow-sm transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
          onClick={handleAddToCart}
          disabled={isOutOfStock || addingToCart}
        >
          <FiShoppingCart size={14} />
          {addingToCart ? "Adding" : "Add to cart"}
        </button>
        <button
          type="button"
          className="inline-flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primarydark disabled:cursor-not-allowed disabled:opacity-60"
          onClick={handleBuyNow}
          disabled={isOutOfStock || isBuying}
        >
          <FiZap size={14} />
          {isBuying ? "Processing" : "Buy now"}
        </button>
      </div>
    </article>
  );
}
