import axios from "axios";
import { useEffect, useState } from "react";
import API from "../../const/api_paths";
import type { Book } from "../../types/book";
import ConfirmModal from "../UI/molecules/modals/ConfirmModal";
import AlertModal from "../UI/molecules/modals/AlertModal";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";

export default function BookDetails({
  id,
  imageUrl,
  title,
  price,
  description,
  stock,
  categoryName,
  created_at,
}: Book & { categoryName: string }) {
  const [quantity, setQuantity] = useState(1);
  const [showorderconfirmmodal, setShowOrderconfirmmodal] = useState(false);
  const [orderplacedalertOpen, setOrderplacedalertOpen] = useState(false);
  const [addcartalertOpen, setAddcartalertOpen] = useState(false);
  const [cartaddloading, setCartaddloading] = useState(false);
  const [buyloading, setBuyloading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!id) return;

    const logViewActivity = async () => {
      try {
        await axios.post(
          API.CREATE_ACTIVITY,
          {
            user_id: user?.id,
            product_id: Number(id),
            action: "view",
          },
          { withCredentials: true }
        );
      } catch (err) {
        console.error("Failed to log view activity", err);
      }
    };

    logViewActivity();
  }, [id]);

  const logBuyActivity = async () => {
    try {
      await axios.post(
        API.CREATE_ACTIVITY,
        {
          user_id: user?.id,
          product_id: Number(id),
          action: "buy",
        },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Failed to log buy activity", err);
    }
  };

  const logCartActivity = async () => {
    try {
      await axios.post(
        API.CREATE_ACTIVITY,
        {
          user_id: user?.id,
          product_id: Number(id),
          action: "add_to_cart",
        },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Failed to log view activity", err);
    }
  };

  const handleAddToCart = async () => {
    setCartaddloading(true);
    try {
      await axios.post(
        API.ADD_TO_CART,
        {
          user_id: user?.id,
          product_id: Number(id),
          quantity: quantity,
        },
        { withCredentials: true }
      );
      logCartActivity();

      setAddcartalertOpen(true);
    } catch (err) {
      console.error("Failed to add to cart", err);
    } finally {
      setCartaddloading(false);
    }
  };
  const handleBuyNow = async () => {
    setBuyloading(true);
    setShowOrderconfirmmodal(false);
    try {
      const response = await axios.post(
        API.CREATE_ORDER,
        {
          user_id: user?.id,
        },
        { withCredentials: true }
      );

      const orderId = response.data.id;
      await axios.post(
        API.CREATE_ORDER_ITEM,
        {
          order_id: orderId,
          product_id: id,
          quantity: quantity,
        },
        { withCredentials: true }
      );
      logBuyActivity();
      setShowOrderconfirmmodal(false);
      setOrderplacedalertOpen(true);
    } catch (err) {
      console.error("Failed to place order", err);
      alert("Something went wrong while placing the order.");
    } finally {
      setBuyloading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <img src={imageUrl} alt={title} className="w-full rounded border" />
        </div>
        <div className="w-full md:w-2/3 bg-secondary p-8 rounded-xl shadow-lg ">
          <h2 className="text-3xl font-bold text-primary mb-3">{title}</h2>

          <p className="text-lg text-gray-800 font-semibold mb-2">
            $. {price.toFixed(2)}
          </p>
          <p className="text-gray-700 mb-3 leading-relaxed">{description}</p>

          <div className="text-sm text-gray-600 mb-1">
            Category: <span className="font-medium">{categoryName}</span>
          </div>
          <div className="text-sm text-gray-600 mb-4">
            Added: {new Date(created_at).toLocaleDateString()}
          </div>

          {stock !== 0 ? (
            <div className="text-green-600 font-medium mb-4">
              Available: {stock} item(s)
            </div>
          ) : (
            <div className="text-red-500 font-semibold mb-4">Out of Stock</div>
          )}

          <div className="flex items-center mb-6 space-x-4">
            <label htmlFor="quantity" className="font-medium text-gray-700">
              Qty:
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
              className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => {
                if (!user) {
                  navigate("/signin");
                } else {
                  handleAddToCart();
                }
              }}
              disabled={stock === 0 || cartaddloading}
              className={`px-6 py-2 rounded-full font-semibold transition duration-300 bg-primary hover:bg-primarydark text-white  ${
                stock === 0 || cartaddloading
                  ? " cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              {cartaddloading ? "Adding to Cart" : "Add to Cart"}
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
              className={`px-6 py-2 rounded-full font-semibold transition duration-300 bg-primary hover:bg-primarydark text-white ${
                stock === 0 || buyloading
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              {buyloading ? "Processing" : "Buy Now"}
            </button>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={showorderconfirmmodal}
        title="Confirm Purchase"
        message="Are you want to buy these items?"
        onConfirm={handleBuyNow}
        onCancel={() => setShowOrderconfirmmodal(false)}
      />
      <AlertModal
        isOpen={orderplacedalertOpen}
        title="Success"
        message="Your order was placed successfully!"
        onClose={() => setOrderplacedalertOpen(false)}
        type="success"
      />
      <AlertModal
        isOpen={addcartalertOpen}
        title="Success"
        message="Added to cart!"
        onClose={() => setAddcartalertOpen(false)}
        type="success"
      />
    </div>
  );
}
