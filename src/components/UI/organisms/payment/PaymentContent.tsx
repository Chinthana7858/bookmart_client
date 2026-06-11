import { useEffect, useMemo, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Navbar from "../../../templates/Navbar";
import Footer from "../../../templates/Footer";
import LoadingSpinner from "../../atoms/LoadingSpinner";
import AlertModal from "../../molecules/modals/AlertModal";
import ConfirmModal from "../../molecules/modals/ConfirmModal";
import { formatDisplayDate } from "../../../../utils/date";
import {
  getApiErrorMessage,
  type PaymentSession,
  useConfirmPaymentMutation,
  useCreatePaymentSessionMutation,
  useGetOrderByIdQuery,
} from "../../../../services/bookmartApi";

export default function Payment() {
  const { orderId } = useParams<{ orderId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const numericOrderId = Number(orderId);
  const [session, setSession] = useState<PaymentSession | null>(null);
  const [errorAlertOpen, setErrorAlertOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successAlertOpen, setSuccessAlertOpen] = useState(false);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
  const [stripeReturnHandled, setStripeReturnHandled] = useState(false);
  const {
    data: order,
    isLoading: orderLoading,
    isError: orderFailed,
    refetch,
  } = useGetOrderByIdQuery(numericOrderId ? numericOrderId : skipToken);
  const [createPaymentSession, { isLoading: sessionLoading }] =
    useCreatePaymentSessionMutation();
  const [confirmPayment, { isLoading: paying }] = useConfirmPaymentMutation();

  const total = useMemo(() => {
    if (!order) return 0;
    return (
      Number(order.total_amount) ||
      order.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      )
    );
  }, [order]);

  useEffect(() => {
    if (!numericOrderId) {
      setErrorMessage("Invalid order.");
      setErrorAlertOpen(true);
      return;
    }
  }, [numericOrderId]);

  useEffect(() => {
    if (orderFailed) {
      setErrorMessage("Could not load payment.");
      setErrorAlertOpen(true);
    }
  }, [orderFailed]);

  useEffect(() => {
    const loadPaymentSession = async () => {
      if (
        !order ||
        order.payment_status === "paid" ||
        session ||
        searchParams.get("payment") === "success"
      ) {
        return;
      }
      try {
        const nextSession = await createPaymentSession({
          order_id: numericOrderId,
        }).unwrap();
        setSession(nextSession);
      } catch (err) {
        setErrorMessage(getApiErrorMessage(err, "Could not load payment."));
        setErrorAlertOpen(true);
      }
    };

    loadPaymentSession();
  }, [createPaymentSession, numericOrderId, order, searchParams, session]);

  useEffect(() => {
    const confirmStripeReturn = async () => {
      const paymentResult = searchParams.get("payment");
      const sessionId = searchParams.get("session_id");
      if (
        stripeReturnHandled ||
        !numericOrderId ||
        paymentResult !== "success" ||
        !sessionId
      ) {
        return;
      }

      setStripeReturnHandled(true);
      try {
        await confirmPayment({
          orderId: numericOrderId,
          session_id: sessionId,
        }).unwrap();
        refetch();
        setSuccessAlertOpen(true);
      } catch (err) {
        setErrorMessage(getApiErrorMessage(err, "Could not confirm Stripe payment."));
        setErrorAlertOpen(true);
      }
    };

    confirmStripeReturn();
  }, [
    confirmPayment,
    numericOrderId,
    refetch,
    searchParams,
    stripeReturnHandled,
  ]);

  useEffect(() => {
    if (searchParams.get("payment") === "cancelled") {
      setErrorMessage("Stripe payment was cancelled.");
      setErrorAlertOpen(true);
    }
  }, [searchParams]);

  const handlePayment = async () => {
    if (!numericOrderId) return;
    try {
      await confirmPayment({ orderId: numericOrderId }).unwrap();
      setShowPaymentConfirm(false);
      refetch();
      setSuccessAlertOpen(true);
    } catch (err) {
      setErrorMessage(getApiErrorMessage(err, "Payment failed."));
      setErrorAlertOpen(true);
    }
  };

  const handlePayNow = () => {
    if (session?.provider === "stripe" && session.payment_url) {
      window.location.assign(session.payment_url);
      return;
    }
    setShowPaymentConfirm(true);
  };

  const loading = orderLoading || sessionLoading;

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      <main className="page-container min-h-screen py-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Payment
          </p>
          <h1 className="text-2xl font-bold text-stone-950">
            Complete your purchase
          </h1>
        </div>

        {loading ? (
          <div className="py-16">
            <LoadingSpinner />
          </div>
        ) : !order ? (
          <div className="surface py-16 text-center text-stone-500">
            Order not found.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <section className="surface p-5">
              <div className="mb-4 flex flex-col gap-2 border-b border-stone-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-stone-950">
                    Order #{order.id}
                  </h2>
                  <p className="text-sm text-stone-500">
                    {formatDisplayDate(order.order_date)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="rounded-full bg-secondary px-3 py-1 font-semibold text-primarydark">
                    {order.status}
                  </span>
                  <span className="rounded-full bg-stone-100 px-3 py-1 font-semibold text-stone-700">
                    {order.payment_status}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className="h-24 w-16 rounded-md border border-stone-200 object-cover"
                    />
                    <div>
                      <p className="font-semibold text-stone-950">
                        {item.product.title}
                      </p>
                      <p className="text-sm text-stone-600">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-stone-600">
                        $ {(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <aside className="surface h-fit p-5">
              <p className="text-sm text-stone-500">Amount due</p>
              <p className="mt-1 text-3xl font-bold text-stone-950">
                $ {total.toFixed(2)}
              </p>
              <div className="mt-4 rounded-md bg-stone-50 p-3 text-sm text-stone-600">
                Provider:{" "}
                <span className="font-semibold text-stone-900">
                  {session?.provider || "mock"}
                </span>
              </div>

              {order.payment_status === "paid" ? (
                <Link to="/orders" className="btn-primary mt-5 w-full">
                  View orders
                </Link>
              ) : (
                <button
                  className="btn-primary mt-5 w-full"
                  onClick={handlePayNow}
                  disabled={paying || sessionLoading || !session}
                >
                  {paying ? "Confirming payment..." : "Pay now"}
                </button>
              )}
              <Link to="/cart" className="btn-secondary mt-3 w-full">
                Back to cart
              </Link>
            </aside>
          </div>
        )}
      </main>
      <Footer />

      <AlertModal
        isOpen={successAlertOpen}
        title="Payment successful"
        message="Your payment was confirmed and the order is now processing."
        onClose={() => navigate("/orders")}
        type="success"
      />
      <ConfirmModal
        isOpen={showPaymentConfirm}
        title="Confirm payment?"
        message={`Pay $ ${total.toFixed(2)} for order #${numericOrderId}?`}
        confirmText="Pay"
        onConfirm={handlePayment}
        onCancel={() => setShowPaymentConfirm(false)}
      />
      <AlertModal
        isOpen={errorAlertOpen}
        title="Payment error"
        message={errorMessage}
        onClose={() => setErrorAlertOpen(false)}
        type="error"
      />
    </div>
  );
}
