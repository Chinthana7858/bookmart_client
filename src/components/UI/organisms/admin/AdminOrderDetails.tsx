import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "flowbite-react";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiMail,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiShoppingBag,
  FiTruck,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import {
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
} from "../../../../services/bookmartApi";
import type { Order } from "../../../../types/order";
import type { UserAddress } from "../../../../types/user";
import { formatDisplayDate } from "../../../../utils/date";
import { DropdownSelect } from "../../atoms/FormControls";
import LoadingSpinner from "../../atoms/LoadingSpinner";
import ConfirmModal from "../../molecules/modals/ConfirmModal";


const ORDER_STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const PAYMENT_STATUS_OPTIONS = [
  { label: "Unpaid", value: "unpaid" },
  { label: "Paid", value: "paid" },
  { label: "Refunded", value: "refunded" },
  { label: "Failed", value: "failed" },
];

const ORDER_PROGRESS_STEPS: Array<{ label: string; Icon: IconType }> = [
  { label: "Review order", Icon: FiShoppingBag },
  { label: "Preparing order", Icon: FiPackage },
  { label: "Shipping", Icon: FiTruck },
  { label: "Delivered", Icon: FiCheckCircle },
];

const ORDER_STATUS_STEP_INDEX: Record<string, number> = {
  pending: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  cancelled: 0,
};

type PendingOrderUpdate = {
  payload: { status?: string; payment_status?: string };
  message: string;
} | null;

function getOrderTotal(order: Order) {
  return (
    Number(order.total_amount) ||
    (order.items ?? []).reduce(
      (sum, item) => sum + Number(item.product?.price ?? 0) * item.quantity,
      0
    )
  );
}

function getStatusBadgeColor(status: string) {
  if (status === "delivered" || status === "paid") return "success";
  if (status === "cancelled" || status === "failed") return "failure";
  if (status === "refunded") return "purple";
  return "warning";
}

function getDefaultAddress(order: Order): UserAddress | undefined {
  return (
    order.user?.addresses?.find((address) => address.is_default) ??
    order.user?.addresses?.[0]
  );
}

function formatAddress(address?: UserAddress, fallback?: string | null) {
  if (!address) return fallback || "No address available";

  return [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.postal_code,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
}

export default function AdminOrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const numericOrderId = Number(orderId);
  const [pendingUpdate, setPendingUpdate] = useState<PendingOrderUpdate>(null);
  const {
    data: order,
    isLoading,
    isError,
    refetch,
  } = useGetOrderByIdQuery(numericOrderId, {
    skip: !Number.isFinite(numericOrderId),
  });
  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  const address = order ? getDefaultAddress(order) : undefined;
  const total = order ? getOrderTotal(order) : 0;
  const itemCount = useMemo(
    () => order?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
    [order]
  );

  const confirmUpdate = async () => {
    if (!order || !pendingUpdate) return;

    try {
      await updateOrderStatus({
        id: order.id,
        ...pendingUpdate.payload,
      }).unwrap();
      setPendingUpdate(null);
      refetch();
    } catch (error) {
      console.error("Failed to update order", error);
      alert("Failed to update order.");
    }
  };

  return (
<>
      {isLoading && (
        <div className="p-8">
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && (isError || !order) && (
        <div className="surface p-8 text-center">
          <h1 className="text-xl font-semibold text-stone-950">
            Order not found
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            This order may have been removed or you may not have access to it.
          </p>
          <button
            type="button"
            className="btn-primary mt-5"
            onClick={() => navigate("/admin/orders")}
          >
            Back to orders
          </button>
        </div>
      )}

      {order && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <button
                type="button"
                className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-stone-200 bg-white text-stone-600 shadow-sm transition hover:border-primary hover:text-primary"
                onClick={() => navigate("/admin/orders")}
                aria-label="Back to orders"
              >
                <FiArrowLeft size={20} />
              </button>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-bold text-stone-950">
                    Order-{order.id}
                  </h1>
                  <Badge color={getStatusBadgeColor(order.payment_status)}>
                    {order.payment_status}
                  </Badge>
                  <Badge color={getStatusBadgeColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-stone-500">
                  Order date {formatDisplayDate(order.order_date)} · Order from{" "}
                  <span className="font-semibold text-stone-900">
                    {order.user?.name || "Unknown customer"}
                  </span>{" "}
                  · Purchased via online store
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                className="btn-secondary h-10"
                onClick={() => navigate("/admin/orders")}
              >
                All orders
              </button>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <section className="surface overflow-hidden">
                <div className="border-b border-stone-200 bg-stone-50 px-5 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-2 text-stone-600">
                      <FiMapPin className="text-primary" />
                      <span>
                        Ship to{" "}
                        <span className="font-semibold text-stone-950">
                          {address?.country || "customer address"}
                        </span>
                      </span>
                    </div>
                    <span className="font-medium text-stone-600">
                      {order.status === "delivered"
                        ? "Delivered"
                        : "Fulfillment in progress"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 px-5 py-5 text-center text-xs font-semibold text-stone-500">
                  {ORDER_PROGRESS_STEPS.map(({ label, Icon }, index) => {
                    const activeIndex =
                      ORDER_STATUS_STEP_INDEX[order.status] ?? 0;
                    const isActive = index <= activeIndex;

                    return (
                      <div key={label} className="space-y-2">
                        <div
                          className={`mx-auto grid h-9 w-9 place-items-center rounded-full ${
                            isActive
                              ? "bg-secondary text-primarydark"
                              : "bg-stone-100 text-stone-400"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>{label}</div>
                        <div
                          className={`h-1 rounded-full ${
                            isActive ? "bg-primary" : "bg-stone-200"
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="surface p-5">
                <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                  <h2 className="text-lg font-semibold text-stone-950">
                    Products
                  </h2>
                  <Badge color={getStatusBadgeColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>

                <div className="divide-y divide-stone-100">
                  {(order.items ?? []).map((item) => {
                    const unitPrice = Number(item.product?.price ?? 0);
                    const lineTotal = unitPrice * item.quantity;

                    return (
                      <div
                        key={item.id}
                        className="grid gap-4 py-5 sm:grid-cols-[88px_minmax(0,1fr)_auto]"
                      >
                        <img
                          src={item.product?.imageUrl}
                          alt={item.product?.title || "Book"}
                          className="h-24 w-24 rounded-md border border-stone-200 object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-stone-950">
                            {item.product?.title || "Unknown book"}
                          </h3>
                          <p className="mt-1 text-sm text-stone-500">
                            Author: {item.product?.author || "Not specified"}
                          </p>
                          <p className="mt-1 text-sm text-stone-500">
                            Publisher: {item.product?.publisher || "Not specified"} ·
                            Language: {item.product?.language || "Not specified"}
                          </p>
                          <p className="mt-2 text-sm font-medium text-stone-700">
                            Quantity {item.quantity}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="font-semibold text-stone-950">
                            $ {lineTotal.toFixed(2)}
                          </p>
                          <p className="mt-1 text-xs text-stone-500">
                            $ {unitPrice.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="surface p-5">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-stone-950">
                    Payment Details
                  </h2>
                  <Badge color={getStatusBadgeColor(order.payment_status)}>
                    {order.payment_status}
                  </Badge>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-stone-500">Items</span>
                    <span className="font-semibold text-stone-950">
                      {itemCount} items
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-stone-500">Subtotal</span>
                    <span className="font-semibold text-stone-950">
                      $ {total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-stone-500">Shipping</span>
                    <span className="font-semibold text-stone-950">$ 0.00</span>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-stone-200 pt-3 text-base">
                    <span className="font-semibold text-stone-950">Total</span>
                    <span className="font-bold text-primary">
                      $ {total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="surface border-t-4 border-t-stone-950 p-5">
                <h2 className="text-lg font-semibold text-stone-950">
                  Manage order
                </h2>
                <div className="mt-5 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-stone-700">
                      Order status
                    </label>
                    <DropdownSelect
                      value={order.status}
                      onChange={(value) =>
                        setPendingUpdate({
                          payload: { status: value },
                          message: `Change order #${order.id} status to "${value}"?`,
                        })
                      }
                      options={ORDER_STATUS_OPTIONS}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-stone-700">
                      Payment status
                    </label>
                    <DropdownSelect
                      value={order.payment_status}
                      onChange={(value) =>
                        setPendingUpdate({
                          payload: { payment_status: value },
                          message: `Change order #${order.id} payment status to "${value}"?`,
                        })
                      }
                      options={PAYMENT_STATUS_OPTIONS}
                    />
                  </div>
                </div>
              </section>

              <section className="surface p-5">
                <h2 className="text-lg font-semibold text-stone-950">
                  Customer
                </h2>
                <div className="mt-5 flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-secondary text-lg font-bold text-primarydark">
                    {(order.user?.name || "C").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-stone-950">
                      {order.user?.name || "Unknown customer"}
                    </p>
                    <p className="text-sm text-stone-500">Customer account</p>
                  </div>
                </div>
              </section>

              <section className="surface p-5">
                <div className="mb-4 flex items-center gap-2">
                  <FiMapPin className="text-primary" />
                  <h2 className="text-lg font-semibold text-stone-950">
                    Shipping Address
                  </h2>
                </div>
                <p className="text-sm leading-6 text-stone-600">
                  {formatAddress(address, order.user?.address)}
                </p>
              </section>

              <section className="surface p-5">
                <h2 className="text-lg font-semibold text-stone-950">
                  Contact Information
                </h2>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center gap-2 rounded-md border border-stone-200 px-3 py-2 text-stone-700">
                    <FiMail className="text-primary" />
                    {order.user?.email || "No email"}
                  </div>
                  <div className="flex items-center gap-2 rounded-md border border-stone-200 px-3 py-2 text-stone-700">
                    <FiPhone className="text-primary" />
                    {order.user?.phone_country_code || ""}
                    {order.user?.phone_number
                      ? ` ${order.user.phone_number}`
                      : " No phone"}
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={pendingUpdate !== null}
        title="Update order?"
        message={pendingUpdate?.message || ""}
        confirmText={isUpdating ? "Updating..." : "Update"}
        onConfirm={confirmUpdate}
        onCancel={() => setPendingUpdate(null)}
      />
 </>
  );
}
