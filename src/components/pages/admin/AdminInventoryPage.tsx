import BookManagement from "../../UI/organisms/admin/BookManagement";
import { ADMIN_TAB_IDS } from "../../../features/admin/adminConstants";
import AdminLayout from "../../../features/admin/layout/AdminLayout";

export default function AdminInventoryPage() {
  return (
    <AdminLayout activeTabId={ADMIN_TAB_IDS.books}>
      <BookManagement />
    </AdminLayout>
  );
}
