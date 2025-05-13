import { useEffect, useState } from "react";
import axios from "axios";
import API from "../../const/api_paths";
import type { CartItem } from "../../types/cart";
import Navbar from "../templates/Navbar";
import { IoIosArrowForward } from "react-icons/io";
import Footer from "../templates/Footer";
import AlertModal from "../UI/molecules/modals/AlertModal";
import ConfirmModal from "../UI/molecules/modals/ConfirmModal";
import { useAuth } from "../../AuthContext";
import LoadingSpinner from "../UI/atoms/LoadingSpinner";

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyloading, setBuyloading] = useState(false);
  const { user } = useAuth();
  const [showorderconfirmmodal, setShowOrderconfirmmodal] = useState(false);
  const [orderplacedalertOpen, setOrderplacedalertOpen] = useState(false);
  let totalPrice = 0;

  const fetchCartItems = async () => {
    try {
      const res = await axios.get(API.GET_CART_ITEMS(user?.id ?? 0), {
        withCredentials: true,
      });
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch cart items", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !user.id) return;

    fetchCartItems();
  }, [user]);

  const removeCartItem = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this item from the cart?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(API.REMOVE_CART_ITEMS(id), {
        withCredentials: true,
      });
      fetchCartItems();
    } catch (err) {
      console.error("Failed to remove cart item", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user || items.length === 0) return;
    setBuyloading(true);
    setShowOrderconfirmmodal(false);
    try {
      const response = await axios.post(
        API.CREATE_ORDER,
        { user_id: user.id },
        { withCredentials: true }
      );
      const orderId = response.data.id;

      for (const item of items) {
        await axios.post(
          API.CREATE_ORDER_ITEM,
          {
            order_id: orderId,
            product_id: item.product_id,
            quantity: item.quantity,
          },
          { withCredentials: true }
        );
      }

      for (const item of items) {
        await axios.delete(API.REMOVE_CART_ITEMS(item.id), {
          withCredentials: true,
        });
      }

      setOrderplacedalertOpen(true);
      fetchCartItems();
    } catch (err) {
      console.error("Failed to place order", err);
      alert("Something went wrong while placing the order.");
    } finally {
      setBuyloading(false);
    }
  };

  for (const item of items) {
    totalPrice += item.product.price * item.quantity;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 min-h-screen">
        <h1 className="text-2xl font-bold mb-6 text-primary">Your Cart</h1>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {items.length === 0 ? (
              <p className="text-gray-600">Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-white p-4 shadow rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.title}
                        className="w-20 h-28 object-cover rounded border"
                      />
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                          {item.product.title}
                        </h2>
                        <p className="text-sm text-gray-600">
                          Price: $ {item.product.price}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                        <div className="text-lg font-bold text-primary">
                          $ {(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div>
                      <button
                        className="bg-primary text-white px-2 py-1 rounded hover:bg-primarydark cursor-pointer"
                        onClick={() => removeCartItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="text-right text-xl font-bold text-primary mt-6">
              Total: $. {totalPrice.toFixed(2)}
            </div>
            {items.length !== 0 ? (
              <div>
                <button
                  disabled={buyloading || user == null}
                  className={`px-6 py-2 rounded-full font-semibold transition duration-300 ${
                    user == null || buyloading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary hover:bg-primarydark text-white cursor-pointer"
                  }`}
                  onClick={() => {
                    setShowOrderconfirmmodal(true);
                  }}
                >
                  <div className=" flex font-xl">
                    {buyloading ? "Processing" : "Buy"}
                    <IoIosArrowForward size={25} />
                  </div>
                </button>
              </div>
            ) : (
              <></>
            )}
          </>
        )}
      </div>
      <Footer />
      <ConfirmModal
        isOpen={showorderconfirmmodal}
        title="Are you want to buy these items?"
        message="This action cannot be undone."
        onConfirm={() => {
          handleBuyNow();
        }}
        onCancel={() => setShowOrderconfirmmodal(false)}
      />
      <AlertModal
        isOpen={orderplacedalertOpen}
        title="Success"
        message="Your order was placed successfully!"
        onClose={() => window.location.reload()}
        type="success"
      />
    </>
  );
}
