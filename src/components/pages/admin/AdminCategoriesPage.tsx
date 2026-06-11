import CategoryManagement from "../../UI/organisms/admin/CategoryManagement";
import { ADMIN_TAB_IDS } from "../../../features/admin/adminConstants";
import AdminLayout from "../../../features/admin/layout/AdminLayout";

export default function AdminCategoriesPage() {
  return (
    <AdminLayout activeTabId={ADMIN_TAB_IDS.categories}>
      <CategoryManagement />
    </AdminLayout>
  );
}
