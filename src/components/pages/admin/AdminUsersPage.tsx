import UserManagement from "../../UI/organisms/admin/UserManagement";
import { ADMIN_TAB_IDS } from "../../../features/admin/adminConstants";
import AdminLayout from "../../../features/admin/layout/AdminLayout";

export default function AdminUsersPage() {
  return (
    <AdminLayout activeTabId={ADMIN_TAB_IDS.users}>
      <UserManagement />
    </AdminLayout>
  );
}
