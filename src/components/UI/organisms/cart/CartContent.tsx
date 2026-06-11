import { useState } from "react";
import Navbar from "../../../templates/Navbar";
import { IoIosArrowForward } from "react-icons/io";
import Footer from "../../../templates/Footer";
import AlertModal from "../../molecules/modals/AlertModal";
import ConfirmModal from "../../molecules/modals/ConfirmModal";
import { useAuth } from "../../../../auth";
import LoadingSpinner from "../../atoms/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import {
  useCheckoutCartMutation,
  useGetMyCartItemsQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "../../../../services/bookmartApi";

export default function Cart() {
  const { user } = useAuth();
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [pendingQuantityUpdate, setPendingQuantityUpdate] = useState<{
    id: number;
    quantity: number;
    title: string;
  } | null>(null);
  const [showorderconfirmmodal, setShowOrderconfirmmodal] = useState(false);
  const [showremoveconfirmmodal, setShowRemoveconfirmmodal] = useState(false);
  const [orderplacedalertOpen, setOrderplacedalertOpen] = useState(false);
  const [errorAlertOpen, setErrorAlertOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const {
    data: items = [],
    isLoading: loading,
    refetch,
  } = useGetMyCartItemsQuery(undefined, { skip: !user?.id });
  const [removeCartItemRequest] = useRemoveCartItemMutation();
  const [updateCartItemRequest] = useUpdateCartItemMutation();
  const [checkoutCart, { isLoading: buyloading }] = useCheckoutCartMutation();

  const removeCartItem = async (id: number) => {
    setShowRemoveconfirmmodal(false);
    try {
      await removeCartItemRequest(id).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to remove cart item", err);
      setErrorMessage("Failed to remove cart item.");
      setErrorAlertOpen(true);
    }
  };

  const updateCartItemQuantity = async () => {
    if (!pendingQuantityUpdate || pendingQuantityUpdate.quantity < 1) return;
    try {
      await updateCartItemRequest({
        id: pendingQuantityUpdate.id,
        quantity: pendingQuantityUpdate.quantity,
      }).unwrap();
      setPendingQuantityUpdate(null);
      refetch();
    } catch (err) {
      console.error("Failed to update cart item", err);
      setErrorMessage("Could not update quantity. Please check available stock.");
      setErrorAlertOpen(true);
    }
  };

  const handleBuyNow = async () => {
    if (!user || items.length === 0) return;
    setShowOrderconfirmmodal(false);
    try {
      const response = await checkoutCart().unwrap();
      navigate(`/payment/${response.id}`);
      refetch();
    } catch (err) {
      console.error("Failed to place order", err);
      setErrorMessage("Something went wrong while placing the order.");
      setErrorAlertOpen(true);
    }
  };

  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      <main className="page-container min-h-screen py-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Checkout
          </p>
          <h1 className="text-2xl font-bold text-stone-950">Your cart</h1>
        </div>

        {loading ? (
          <div className="py-16">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {items.length === 0 ? (
              <div className="surface py-16 text-center text-stone-500">
                Your cart is empty.
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="surface flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.title}
                        className="h-28 w-20 rounded-md border border-stone-200 object-cover"
                      />
                      <div>
                        <h2 className="text-lg font-semibold text-stone-950">
                          {item.product.title}
                        </h2>
                        <p className="mt-1 text-sm text-stone-600">
                          Price: $ {item.product.price}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            className="grid h-8 w-8 place-items-center rounded-md border border-stone-300 text-stone-700 hover:border-primary hover:text-primary"
                            onClick={() =>
                              setPendingQuantityUpdate({
                                id: item.id,
                                quantity: item.quantity - 1,
                                title: item.product.title,
                              })
                            }
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="min-w-8 text-center text-sm font-semibold text-stone-700">
                            {item.quantity}
                          </span>
                          <button
                            className="grid h-8 w-8 place-items-center rounded-md border border-stone-300 text-stone-700 hover:border-primary hover:text-primary"
                            onClick={() =>
                              setPendingQuantityUpdate({
                                id: item.id,
                                quantity: item.quantity + 1,
                                title: item.product.title,
                              })
                            }
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <div className="mt-1 text-lg font-bold text-primary">
                          $ {(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn-secondary h-10 self-start sm:self-center"
                      onClick={() => {
                        setSelectedItemId(item.id);
                        setShowRemoveconfirmmodal(true);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            {items.length !== 0 ? (
              <div className="surface mt-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-stone-500">Cart total</p>
                  <p className="text-2xl font-bold text-stone-950">
                    $ {totalPrice.toFixed(2)}
                  </p>
                </div>
                <button
                  disabled={buyloading || user == null}
                  className="btn-primary"
                  onClick={() => {
                    setShowOrderconfirmmodal(true);
                  }}
                >
                  {buyloading ? "Processing" : "Buy"}
                  <IoIosArrowForward size={25} />
                </button>
              </div>
            ) : (
              <></>
            )}
          </>
        )}
      </main>
      <Footer />
      <ConfirmModal
        isOpen={showremoveconfirmmodal}
        title="Remove Item"
        message="Are you sure you want to remove this item from your cart?"
        onConfirm={() => selectedItemId && removeCartItem(selectedItemId)}
        onCancel={() => setShowRemoveconfirmmodal(false)}
      />
      <ConfirmModal
        isOpen={showorderconfirmmodal}
        title="Confirm Purchase"
        message="Do you want to buy these items?"
        onConfirm={() => {
          handleBuyNow();
        }}
        onCancel={() => setShowOrderconfirmmodal(false)}
      />
      <ConfirmModal
        isOpen={pendingQuantityUpdate !== null}
        title="Update quantity?"
        message={
          pendingQuantityUpdate
            ? `Set "${pendingQuantityUpdate.title}" quantity to ${pendingQuantityUpdate.quantity}?`
            : ""
        }
        confirmText="Update"
        onConfirm={updateCartItemQuantity}
        onCancel={() => setPendingQuantityUpdate(null)}
      />
      <AlertModal
        isOpen={orderplacedalertOpen}
        title="Success"
        message="Your order was placed successfully!"
        onClose={() => setOrderplacedalertOpen(false)}
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
