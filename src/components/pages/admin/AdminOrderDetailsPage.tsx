import AdminLayout from "../../../features/admin/layout/AdminLayout";
import { ADMIN_TAB_IDS } from "../../../features/admin/adminConstants";
import AdminOrderDetails from "../../UI/organisms/admin/AdminOrderDetails";

export default function AdminOrderDetailsPage() {
  return (
    <AdminLayout activeTabId={ADMIN_TAB_IDS.orders}>
      <AdminOrderDetails />
    </AdminLayout>
  );
}
