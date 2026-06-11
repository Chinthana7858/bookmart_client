import AdminUserDetails from "../../UI/organisms/admin/AdminUserDetails";
import { ADMIN_TAB_IDS } from "../../../features/admin/adminConstants";
import AdminLayout from "../../../features/admin/layout/AdminLayout";

export default function AdminUserDetailsPage() {
  return (
    <AdminLayout activeTabId={ADMIN_TAB_IDS.users}>
      <AdminUserDetails />
    </AdminLayout>
  );
}
