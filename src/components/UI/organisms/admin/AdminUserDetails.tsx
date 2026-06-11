import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "flowbite-react";
import {
  FiArrowLeft,
  FiCalendar,
  FiMail,
  FiMapPin,
  FiPhone,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";
import LoadingSpinner from "../../atoms/LoadingSpinner";
import {
  useGetOrdersByUserQuery,
  useGetUserByIdQuery,
} from "../../../../services/bookmartApi";
import type { Order } from "../../../../types/order";
import type { UserAddress } from "../../../../types/user";
import { formatDisplayDate } from "../../../../utils/date";

function formatGender(value?: string | null) {
  return value ? value.split("_").join(" ") : "Not provided";
}

function formatPhone(countryCode?: string | null, phone?: string | null) {
  return [countryCode, phone].filter(Boolean).join(" ") || "Not provided";
}

function formatAddress(address: UserAddress) {
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

function getOrderTotal(order: Order) {
  return (
    Number(order.total_amount) ||
    (order.items ?? []).reduce(
      (sum, item) => sum + Number(item.product?.price ?? 0) * item.quantity,
      0
    )
  );
}

export default function AdminUserDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const numericUserId = Number(userId);
  const {
    data: user,
    isLoading: userLoading,
    isError: userFailed,
  } = useGetUserByIdQuery(numericUserId, {
    skip: !Number.isFinite(numericUserId),
  });
  const {
    data: orders = [],
    isLoading: ordersLoading,
    isError: ordersFailed,
  } = useGetOrdersByUserQuery(numericUserId, {
    skip: !Number.isFinite(numericUserId),
  });

  const orderSummary = useMemo(() => {
    const totalSpend = orders.reduce((sum, order) => sum + getOrderTotal(order), 0);
    const paidOrders = orders.filter((order) => order.payment_status === "paid").length;

    return {
      totalSpend,
      paidOrders,
      totalOrders: orders.length,
    };
  }, [orders]);

  if (userLoading) {
    return (
      <div className="p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (userFailed || !user) {
    return (
      <div className="surface p-8 text-center">
        <h1 className="text-xl font-semibold text-stone-950">User not found</h1>
        <p className="mt-2 text-sm text-stone-500">
          This user account may have been removed or is unavailable.
        </p>
        <button
          type="button"
          className="btn-primary mt-5"
          onClick={() => navigate("/admin/users")}
        >
          Back to users
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <button
            type="button"
            className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-stone-200 bg-white text-stone-600 shadow-sm transition hover:border-primary hover:text-primary"
            onClick={() => navigate("/admin/users")}
            aria-label="Back to users"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold text-stone-950">{user.name}</h1>
              <Badge color={user.role === "admin" ? "warning" : "success"}>
                {user.role}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-stone-500">
              Account #{user.id} · {user.email}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="surface p-5">
            <div className="mb-4 flex items-center gap-2">
              <FiUser className="text-primary" />
              <h2 className="text-lg font-semibold text-stone-950">
                Personal details
              </h2>
            </div>
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-stone-500">Full name</dt>
                <dd className="mt-1 font-semibold text-stone-950">{user.name}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Gender</dt>
                <dd className="mt-1 font-semibold capitalize text-stone-950">
                  {formatGender(user.gender)}
                </dd>
              </div>
              <div>
                <dt className="text-stone-500">Birthday</dt>
                <dd className="mt-1 font-semibold text-stone-950">
                  {formatDisplayDate(user.birthday)}
                </dd>
              </div>
              <div>
                <dt className="text-stone-500">Role</dt>
                <dd className="mt-1 font-semibold text-stone-950">{user.role}</dd>
              </div>
            </dl>
          </section>

          <section className="surface p-5">
            <div className="mb-4 flex items-center gap-2">
              <FiMapPin className="text-primary" />
              <h2 className="text-lg font-semibold text-stone-950">
                Address book
              </h2>
            </div>
            {user.addresses?.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {user.addresses.map((address) => (
                  <article
                    key={address.id}
                    className="rounded-md border border-stone-200 bg-white p-4"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-stone-950">
                        {address.label}
                      </h3>
                      {address.is_default && (
                        <Badge color="warning">Default</Badge>
                      )}
                    </div>
                    <p className="text-sm leading-6 text-stone-600">
                      {formatAddress(address)}
                    </p>
                    <p className="mt-3 text-sm text-stone-500">
                      Recipient: {address.recipient_name || user.name}
                    </p>
                    <p className="mt-1 text-sm text-stone-500">
                      Phone: {formatPhone(address.phone_country_code, address.phone_number)}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone-500">
                {user.address || "No saved addresses."}
              </p>
            )}
          </section>

          <section className="surface p-5">
            <div className="mb-4 flex items-center gap-2">
              <FiShoppingBag className="text-primary" />
              <h2 className="text-lg font-semibold text-stone-950">
                Orders
              </h2>
            </div>

            {ordersLoading ? (
              <LoadingSpinner />
            ) : ordersFailed || orders.length === 0 ? (
              <div className="rounded-md border border-stone-200 py-10 text-center text-sm text-stone-500">
                No orders found for this user.
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {orders.map((order) => (
                  <button
                    key={order.id}
                    type="button"
                    className="grid w-full cursor-pointer gap-3 py-4 text-left transition hover:bg-orange-50 sm:grid-cols-[1fr_auto]"
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                  >
                    <div>
                      <p className="font-semibold text-stone-950">
                        Order #{order.id}
                      </p>
                      <p className="mt-1 text-sm text-stone-500">
                        {formatDisplayDate(order.order_date)} · {order.items?.length ?? 0} line items
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <Badge color={order.status === "delivered" ? "success" : "warning"}>
                        {order.status}
                      </Badge>
                      <Badge color={order.payment_status === "paid" ? "success" : "gray"}>
                        {order.payment_status}
                      </Badge>
                      <span className="font-bold text-primary">
                        $ {getOrderTotal(order).toFixed(2)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="surface p-5">
            <h2 className="text-lg font-semibold text-stone-950">
              Contact information
            </h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center gap-2 rounded-md border border-stone-200 px-3 py-2 text-stone-700">
                <FiMail className="text-primary" />
                {user.email}
              </div>
              <div className="flex items-center gap-2 rounded-md border border-stone-200 px-3 py-2 text-stone-700">
                <FiPhone className="text-primary" />
                {formatPhone(user.phone_country_code, user.phone_number)}
              </div>
              <div className="flex items-center gap-2 rounded-md border border-stone-200 px-3 py-2 text-stone-700">
                <FiCalendar className="text-primary" />
                {formatDisplayDate(user.birthday)}
              </div>
            </div>
          </section>

          <section className="surface p-5">
            <h2 className="text-lg font-semibold text-stone-950">
              Order summary
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-stone-500">Total orders</dt>
                <dd className="font-semibold text-stone-950">
                  {orderSummary.totalOrders}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-500">Paid orders</dt>
                <dd className="font-semibold text-stone-950">
                  {orderSummary.paidOrders}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-stone-200 pt-3">
                <dt className="font-semibold text-stone-950">Total spend</dt>
                <dd className="font-bold text-primary">
                  $ {orderSummary.totalSpend.toFixed(2)}
                </dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}
