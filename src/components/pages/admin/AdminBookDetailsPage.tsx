import AdminBookDetails from "../../UI/organisms/admin/AdminBookDetails";
import { ADMIN_TAB_IDS } from "../../../features/admin/adminConstants";
import AdminLayout from "../../../features/admin/layout/AdminLayout";

export default function AdminBookDetailsPage() {
  return (
    <AdminLayout activeTabId={ADMIN_TAB_IDS.books}>
      <AdminBookDetails />
    </AdminLayout>
  );
}
