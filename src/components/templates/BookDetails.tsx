import { useEffect, useState } from "react";
import type { Book } from "../../types/book";
import ConfirmModal from "../UI/molecules/modals/ConfirmModal";
import AlertModal from "../UI/molecules/modals/AlertModal";
import { useAuth } from "../../auth";
import { useNavigate } from "react-router-dom";
import { formatDisplayDate } from "../../utils/date";
import {
  useAddToCartMutation,
  useCreateActivityMutation,
  useCreateOrderItemMutation,
  useCreateOrderMutation,
} from "../../services/bookmartApi";

export default function BookDetails({
  id,
  imageUrl,
  title,
  price,
  description,
  publisher,
  author,
  language,
  stock,
  categoryNames,
  created_at,
}: Book & { categoryNames: string[] }) {
  const [quantity, setQuantity] = useState(1);
  const [showorderconfirmmodal, setShowOrderconfirmmodal] = useState(false);
  const [showcartconfirmmodal, setShowCartconfirmmodal] = useState(false);
  const [addcartalertOpen, setAddcartalertOpen] = useState(false);
  const [errorAlertOpen, setErrorAlertOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [createActivity] = useCreateActivityMutation();
  const [addToCart, { isLoading: cartaddloading }] = useAddToCartMutation();
  const [createOrder, { isLoading: creatingOrder }] = useCreateOrderMutation();
  const [createOrderItem, { isLoading: creatingOrderItem }] = useCreateOrderItemMutation();
  const buyloading = creatingOrder || creatingOrderItem;

  useEffect(() => {
    if (!id) return;

    const logViewActivity = async () => {
      try {
        await createActivity({
            user_id: user?.id,
            product_id: Number(id),
            action: "view",
        }).unwrap();
      } catch (err) {
        console.error("Failed to log view activity", err);
      }
    };

    logViewActivity();
  }, [createActivity, id, user?.id]);

  const logBuyActivity = async () => {
    try {
      await createActivity({
          user_id: user?.id,
          product_id: Number(id),
          action: "buy",
      }).unwrap();
    } catch (err) {
      console.error("Failed to log buy activity", err);
    }
  };

  const logCartActivity = async () => {
    try {
      await createActivity({
          user_id: user?.id,
          product_id: Number(id),
          action: "add_to_cart",
      }).unwrap();
    } catch (err) {
      console.error("Failed to log view activity", err);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart({
        product_id: Number(id),
        quantity: quantity,
      }).unwrap();
      logCartActivity();

      setShowCartconfirmmodal(false);
      setAddcartalertOpen(true);
    } catch (err) {
      console.error("Failed to add to cart", err);
      setErrorMessage("Could not add this book to your cart. Please check stock and try again.");
      setErrorAlertOpen(true);
    }
  };
  const handleBuyNow = async () => {
    setShowOrderconfirmmodal(false);
    try {
      const response = await createOrder().unwrap();
      const orderId = response.id;
      await createOrderItem({
          order_id: orderId,
          product_id: id,
          quantity: quantity,
      }).unwrap();
      logBuyActivity();
      setShowOrderconfirmmodal(false);
      navigate(`/payment/${orderId}`);
    } catch (err) {
      console.error("Failed to place order", err);
      setErrorMessage("Something went wrong while placing the order.");
      setErrorAlertOpen(true);
    }
  };

  return (
    <div className="page-container py-8">
      <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
        <div className="surface overflow-hidden p-4">
          <div className="aspect-[3/4] overflow-hidden rounded-md bg-stone-100">
            <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="surface p-6 md:p-8">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            {categoryNames.map((categoryName) => (
              <span
                key={categoryName}
                className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primarydark"
              >
                {categoryName}
              </span>
            ))}
            <span className="text-sm text-stone-500">
              Added {formatDisplayDate(created_at)}
            </span>
          </div>

          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-stone-950 md:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-2xl font-bold text-primary">
            $ {Number(price).toFixed(2)}
          </p>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-600">
            {description}
          </p>

          <dl className="mt-6 grid gap-3 border-t border-stone-200 pt-6 text-sm sm:grid-cols-3">
            <div>
              <dt className="font-semibold text-stone-950">Author</dt>
              <dd className="mt-1 text-stone-600">{author || "Unknown"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-stone-950">Publisher</dt>
              <dd className="mt-1 text-stone-600">{publisher || "Unknown"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-stone-950">Language</dt>
              <dd className="mt-1 text-stone-600">{language || "Unknown"}</dd>
            </div>
          </dl>

          <div className="mt-6">
            {stock !== 0 ? (
              <div className="inline-flex rounded-md bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                In stock: {stock} item(s)
              </div>
            ) : (
              <div className="inline-flex rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                Out of stock
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-5 border-t border-stone-200 pt-6 sm:flex-row sm:items-end">
            <div>
              <label htmlFor="quantity" className="mb-2 block text-sm font-semibold text-stone-700">
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                min={1}
                max={stock}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Math.min(stock, +e.target.value)))
                }
                className="field w-28"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => {
                  if (!user) {
                    navigate("/signin");
                  } else {
                    setShowCartconfirmmodal(true);
                  }
                }}
                disabled={stock === 0 || cartaddloading}
                className="btn-secondary"
              >
                {cartaddloading ? "Adding" : "Add to cart"}
              </button>

              <button
                onClick={() => {
                  if (!user) {
                    navigate("/signin");
                  } else {
                    setShowOrderconfirmmodal(true);
                  }
                }}
                disabled={stock === 0 || buyloading}
                className="btn-primary"
              >
                {buyloading ? "Processing" : "Buy now"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={showorderconfirmmodal}
        title="Confirm Purchase"
        message="Do you want to buy these items?"
        onConfirm={handleBuyNow}
        onCancel={() => setShowOrderconfirmmodal(false)}
      />
      <ConfirmModal
        isOpen={showcartconfirmmodal}
        title="Add to cart?"
        message={`Add ${quantity} item(s) of "${title}" to your cart?`}
        confirmText="Add"
        onConfirm={handleAddToCart}
        onCancel={() => setShowCartconfirmmodal(false)}
      />
      <AlertModal
        isOpen={addcartalertOpen}
        title="Success"
        message="Added to cart!"
        onClose={() => setAddcartalertOpen(false)}
        type="success"
      />
      <AlertModal
        isOpen={errorAlertOpen}
        title="Error"
        message={errorMessage}
        onClose={() => setErrorAlertOpen(false)}
        type="error"
      />
    </div>
  );
}
