import AdminDashboardOverview from "../../UI/organisms/admin/AdminDashboardOverview";
import { ADMIN_TAB_IDS } from "../../../features/admin/adminConstants";
import AdminLayout from "../../../features/admin/layout/AdminLayout";

export default function AdminDashboard() {
  return (
    <AdminLayout activeTabId={ADMIN_TAB_IDS.dashboard}>
      <AdminDashboardOverview />
    </AdminLayout>
  );
}
