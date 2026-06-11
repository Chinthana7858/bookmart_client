import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../atoms/LoadingSpinner";
import { DropdownSelect, SearchBar } from "../../atoms/FormControls";
import PaginationControls from "../../atoms/PaginationControls";
import { formatDisplayDate } from "../../../../utils/date";
import { ADMIN_PAGE_SIZE } from "../../../../features/admin/adminConstants";
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import {
  useGetOrdersPaginatedQuery,
} from "../../../../services/bookmartApi";

export default function OrderManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [sortMethod, setSortMethod] = useState("order_date-desc");
  const navigate = useNavigate();
  const [sortBy, sortOrder] = sortMethod.split("-") as [string, "asc" | "desc"];
  const { data, isLoading: loading } = useGetOrdersPaginatedQuery({
    skip: (currentPage - 1) * ADMIN_PAGE_SIZE,
    limit: ADMIN_PAGE_SIZE,
    search: searchTerm.trim(),
    status: statusFilter,
    payment_status: paymentFilter,
    sort_by: sortBy,
    sort_order: sortOrder,
  });
  const orders = data?.orders ?? [];
  const totalOrders = data?.total ?? 0;

  const totalPages = Math.max(1, Math.ceil(totalOrders / ADMIN_PAGE_SIZE));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, paymentFilter, sortMethod]);

  if (loading) return <div className="p-8"><LoadingSpinner /></div>;

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-stone-950">All Orders</h1>
        <p className="mt-1 text-sm text-stone-500">Search and review order activity. Open an order to manage details.</p>
      </div>

      <div className="surface mb-6 grid gap-4 p-4 lg:grid-cols-[minmax(260px,1fr)_repeat(3,minmax(180px,220px))]">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search order, customer, email, or book"
          className="w-full"
        />
        <DropdownSelect
          label="Order Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { label: "All Order Statuses", value: "" },
            { label: "Pending", value: "pending" },
            { label: "Processing", value: "processing" },
            { label: "Shipped", value: "shipped" },
            { label: "Delivered", value: "delivered" },
            { label: "Cancelled", value: "cancelled" },
          ]}
        />
        <DropdownSelect
          label="Payment"
          value={paymentFilter}
          onChange={setPaymentFilter}
          options={[
            { label: "All Payments", value: "" },
            { label: "Unpaid", value: "unpaid" },
            { label: "Paid", value: "paid" },
            { label: "Refunded", value: "refunded" },
            { label: "Failed", value: "failed" },
          ]}
        />
        <DropdownSelect
          label="Sort by"
          value={sortMethod}
          onChange={setSortMethod}
          options={[
            { label: "Newest First", value: "order_date-desc" },
            { label: "Oldest First", value: "order_date-asc" },
            { label: "Order ID: High to Low", value: "id-desc" },
            { label: "Order ID: Low to High", value: "id-asc" },
            { label: "Customer: A to Z", value: "customer-asc" },
            { label: "Customer: Z to A", value: "customer-desc" },
            { label: "Total: High to Low", value: "total-desc" },
            { label: "Total: Low to High", value: "total-asc" },
            { label: "Order Status: A to Z", value: "status-asc" },
            { label: "Payment: A to Z", value: "payment_status-asc" },
          ]}
        />
      </div>

      {orders.length === 0 ? (
        <div className="surface py-12 text-center text-stone-500">No orders found.</div>
      ) : (
        <>
          <div className="bookmart-table overflow-x-auto sm:rounded-lg">
            <Table hoverable>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Order</TableHeadCell>
                  <TableHeadCell>Customer</TableHeadCell>
                  <TableHeadCell>Items</TableHeadCell>
                  <TableHeadCell>Total</TableHeadCell>
                  <TableHeadCell>Order Status</TableHeadCell>
                  <TableHeadCell>Payment</TableHeadCell>
                  <TableHeadCell>Date</TableHeadCell>
                  <TableHeadCell>Action</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {orders.map((order) => {
                    const items = order.items ?? [];
                    const total =
                      Number(order.total_amount) ||
                      items.reduce(
                        (sum, item) =>
                          sum + Number(item.product?.price ?? 0) * item.quantity,
                        0
                      );
                    const customerName = order.user?.name || "Unknown customer";
                    const customerEmail = order.user?.email || "No email";

                    return (
                      <TableRow
                        key={order.id}
                        className="cursor-pointer bg-white"
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                      >
                        <TableCell className="font-medium text-gray-900">#{order.id}</TableCell>
                        <TableCell>
                          <div className="font-medium text-gray-900">{customerName}</div>
                          <div className="text-xs text-gray-500">{customerEmail}</div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs space-y-1">
                            {items.length === 0 ? (
                              <span className="text-gray-400">No items</span>
                            ) : (
                              items.map((item) => (
                                <div key={item.id} className="text-xs">
                                  <span className="font-medium text-gray-700">
                                    {item.product?.title || "Unknown book"}
                                  </span>
                                  <span className="text-gray-500"> x {item.quantity}</span>
                                </div>
                              ))
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-gray-900">
                          $ {total.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            color={
                              order.status === "delivered"
                                ? "success"
                                : order.status === "cancelled"
                                  ? "failure"
                                  : "warning"
                            }
                            className="w-fit"
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            color={order.payment_status === "paid" ? "success" : "gray"}
                            className="w-fit"
                          >
                            {order.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDisplayDate(order.order_date)}
                        </TableCell>
                        <TableCell>
                          <button
                            type="button"
                            className="cursor-pointer font-semibold text-primary transition hover:text-primarydark"
                            onClick={(event) => {
                              event.stopPropagation();
                              navigate(`/admin/orders/${order.id}`);
                            }}
                          >
                            View details
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
