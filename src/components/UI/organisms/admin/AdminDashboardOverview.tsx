import { Badge } from "flowbite-react";
import { Link } from "react-router-dom";
import {
  FiAlertTriangle,
  FiBookOpen,
  FiCreditCard,
  FiDollarSign,
  FiPackage,
  FiShoppingBag,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import LoadingSpinner from "../../atoms/LoadingSpinner";
import { formatDisplayDate } from "../../../../utils/date";
import {
  type DashboardBreakdownItem,
  type DashboardProductSummary,
  type DashboardRecentOrder,
  useGetAdminDashboardSummaryQuery,
} from "../../../../services/bookmartApi";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const formatCurrency = (value: number | string | null | undefined) =>
  currencyFormatter.format(Number(value ?? 0));

const formatNumber = (value: number | string | null | undefined) =>
  new Intl.NumberFormat("en-US").format(Number(value ?? 0));

const statusBadgeColor = (status: string) => {
  switch (status) {
    case "paid":
    case "delivered":
      return "success";
    case "failed":
    case "cancelled":
      return "failure";
    case "shipped":
    case "processing":
      return "info";
    default:
      return "warning";
  }
};

function MetricCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = "stone",
}: {
  label: string;
  value: string;
  helper: string;
  icon: IconType;
  tone?: "orange" | "green" | "blue" | "amber" | "stone";
}) {
  const toneClasses = {
    orange: "bg-orange-50 text-primary",
    green: "bg-emerald-50 text-emerald-600",
    blue: "bg-sky-50 text-sky-600",
    amber: "bg-amber-50 text-amber-600",
    stone: "bg-stone-100 text-stone-600",
  };

  return (
    <div className="rounded-md border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-stone-500">{label}</p>
          <p className="mt-3 text-2xl font-bold text-stone-950">{value}</p>
          <p className="mt-2 text-xs leading-5 text-stone-500">{helper}</p>
        </div>
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-md ${toneClasses[tone]}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function BreakdownPanel({
  title,
  total,
  items,
}: {
  title: string;
  total: number;
  items: DashboardBreakdownItem[];
}) {
  return (
    <section className="rounded-md border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-stone-950">{title}</h2>
        <span className="text-sm font-medium text-stone-500">{formatNumber(total)} total</span>
      </div>
      <div className="mt-5 space-y-4">
        {items.map((item) => {
          const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;

          return (
            <div key={item.key}>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-stone-700">{item.label}</span>
                <span className="text-stone-500">
                  {formatNumber(item.count)} · {percentage}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-stone-100">
                <div
                  className="h-2 rounded-full bg-primary transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function OrderList({
  title,
  orders,
  emptyText,
}: {
  title: string;
  orders: DashboardRecentOrder[];
  emptyText: string;
}) {
  return (
    <section className="rounded-md border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-stone-950">{title}</h2>
        <Link className="text-sm font-semibold text-primary hover:text-primarydark" to="/admin/orders">
          View all
        </Link>
      </div>
      <div className="mt-4 divide-y divide-stone-100">
        {orders.length === 0 ? (
          <p className="py-6 text-sm text-stone-500">{emptyText}</p>
        ) : (
          orders.map((order) => (
            <Link
              key={order.id}
              to={`/admin/orders/${order.id}`}
              className="flex cursor-pointer items-center justify-between gap-4 py-4 transition hover:bg-orange-50/50"
            >
              <div className="min-w-0">
                <p className="font-semibold text-stone-950">Order #{order.id}</p>
                <p className="mt-1 truncate text-sm text-stone-500">
                  {order.customer_name} · {formatDisplayDate(order.order_date)}
                </p>
                <p className="mt-1 text-xs text-stone-400">
                  {formatNumber(order.item_count)} item{order.item_count === 1 ? "" : "s"}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-semibold text-stone-950">{formatCurrency(order.total_amount)}</p>
                <div className="mt-2 flex justify-end gap-2">
                  <Badge color={statusBadgeColor(order.status)}>{order.status}</Badge>
                  <Badge color={statusBadgeColor(order.payment_status)}>{order.payment_status}</Badge>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}

function ProductList({
  title,
  products,
  emptyText,
  variant,
}: {
  title: string;
  products: DashboardProductSummary[];
  emptyText: string;
  variant: "stock" | "sales";
}) {
  return (
    <section className="rounded-md border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-stone-950">{title}</h2>
        <Link className="text-sm font-semibold text-primary hover:text-primarydark" to="/admin/inventory">
          Inventory
        </Link>
      </div>
      <div className="mt-4 divide-y divide-stone-100">
        {products.length === 0 ? (
          <p className="py-6 text-sm text-stone-500">{emptyText}</p>
        ) : (
          products.map((product) => (
            <Link
              key={product.id}
              to={`/admin/inventory/${product.id}`}
              className="flex cursor-pointer items-center justify-between gap-4 py-4 transition hover:bg-orange-50/50"
            >
              <div className="flex min-w-0 items-center gap-3">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="h-12 w-10 rounded object-cover"
                  />
                ) : (
                  <div className="grid h-12 w-10 shrink-0 place-items-center rounded bg-orange-50 text-primary">
                    <FiBookOpen size={16} />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate font-semibold text-stone-950">{product.title}</p>
                  <p className="mt-1 truncate text-sm text-stone-500">
                    {product.author || "Author not specified"}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                {variant === "stock" ? (
                  <>
                    <Badge color={product.stock <= 0 ? "failure" : "warning"}>
                      {formatNumber(product.stock)} left
                    </Badge>
                    <p className="mt-2 text-sm text-stone-500">{formatCurrency(product.price)}</p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-stone-950">
                      {formatNumber(product.sold_quantity)} sold
                    </p>
                    <p className="mt-1 text-sm text-stone-500">
                      {formatCurrency(product.revenue)}
                    </p>
                  </>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}

export default function AdminDashboardOverview() {
  const { data, isLoading, isError, refetch } = useGetAdminDashboardSummaryQuery();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !data) {
    return (
      <div className="rounded-md border border-red-100 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-900">Dashboard unavailable</h2>
        <p className="mt-2 text-sm text-red-700">
          The dashboard metrics could not be loaded.
        </p>
        <button type="button" className="btn-primary mt-4" onClick={() => refetch()}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total revenue"
          value={formatCurrency(data.total_revenue)}
          helper={`${formatCurrency(data.revenue_this_month)} this month`}
          icon={FiDollarSign}
          tone="orange"
        />
        <MetricCard
          label="Total orders"
          value={formatNumber(data.total_orders)}
          helper={`${formatNumber(data.pending_orders)} pending fulfilment`}
          icon={FiShoppingBag}
          tone="blue"
        />
        <MetricCard
          label="Customers"
          value={formatNumber(data.total_customers)}
          helper={`${formatNumber(data.total_admins)} admin account${data.total_admins === 1 ? "" : "s"}`}
          icon={FiUsers}
          tone="green"
        />
        <MetricCard
          label="Inventory"
          value={formatNumber(data.total_books)}
          helper={`${formatNumber(data.low_stock_count)} low stock · ${formatNumber(data.out_of_stock_count)} out`}
          icon={FiBookOpen}
          tone="amber"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Average order value"
          value={formatCurrency(data.average_order_value)}
          helper={`${formatNumber(data.paid_orders)} paid order${data.paid_orders === 1 ? "" : "s"}`}
          icon={FiTrendingUp}
          tone="green"
        />
        <MetricCard
          label="Unpaid amount"
          value={formatCurrency(data.unpaid_amount)}
          helper={`${formatNumber(data.unpaid_orders)} unpaid order${data.unpaid_orders === 1 ? "" : "s"}`}
          icon={FiCreditCard}
          tone="orange"
        />
        <MetricCard
          label="Needs attention"
          value={formatNumber(data.low_stock_count + data.unpaid_orders)}
          helper="Low-stock books and unpaid orders"
          icon={FiAlertTriangle}
          tone="amber"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <BreakdownPanel
          title="Order status"
          total={data.total_orders}
          items={data.order_status_breakdown}
        />
        <BreakdownPanel
          title="Payment status"
          total={data.total_orders}
          items={data.payment_status_breakdown}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <OrderList
          title="Recent orders"
          orders={data.recent_orders}
          emptyText="No orders have been placed yet."
        />
        <OrderList
          title="Unpaid orders"
          orders={data.unpaid_recent_orders}
          emptyText="No unpaid orders need follow-up."
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ProductList
          title="Low-stock books"
          products={data.low_stock_books}
          emptyText="Inventory is healthy."
          variant="stock"
        />
        <ProductList
          title="Top-selling books"
          products={data.top_selling_books}
          emptyText="No sold books yet."
          variant="sales"
        />
      </div>

      <section className="rounded-md border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-stone-950">Top categories</h2>
          <FiPackage className="text-primary" size={20} />
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {data.top_categories.length === 0 ? (
            <p className="text-sm text-stone-500">No category performance data yet.</p>
          ) : (
            data.top_categories.map((category) => (
              <div key={category.id} className="rounded-md border border-orange-100 bg-orange-50 p-4">
                <p className="truncate font-semibold text-stone-950">{category.name}</p>
                <p className="mt-3 text-2xl font-bold text-primary">
                  {formatNumber(category.sold_quantity)}
                </p>
                <p className="mt-1 text-xs text-stone-500">
                  sold · {formatNumber(category.product_count)} products
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
