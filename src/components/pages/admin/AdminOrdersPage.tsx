import OrderManagement from "../../UI/organisms/admin/OrderManagement";
import { ADMIN_TAB_IDS } from "../../../features/admin/adminConstants";
import AdminLayout from "../../../features/admin/layout/AdminLayout";

export default function AdminOrdersPage() {
  return (
    <AdminLayout activeTabId={ADMIN_TAB_IDS.orders}>
      <OrderManagement />
    </AdminLayout>
  );
}
