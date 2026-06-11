import { ADMIN_TAB_IDS, type AdminTabId } from "./adminConstants";

type AdminTab = {
  id: AdminTabId;
  label: string;
  description: string;
  path: string;
};

export const adminTabs: AdminTab[] = [
  {
    id: ADMIN_TAB_IDS.dashboard,
    label: "Dashboard",
    description: "Monitor sales, orders, inventory, and customer activity",
    path: "/admin/dashboard",
  },
  {
    id: ADMIN_TAB_IDS.books,
    label: "Inventory",
    description: "Review catalogue stock and item data",
    path: "/admin/inventory",
  },
  {
    id: ADMIN_TAB_IDS.categories,
    label: "Categories",
    description: "Organize book groups",
    path: "/admin/categories",
  },
  {
    id: ADMIN_TAB_IDS.orders,
    label: "Orders",
    description: "Track fulfillment and payment",
    path: "/admin/orders",
  },
  {
    id: ADMIN_TAB_IDS.users,
    label: "Users",
    description: "Review customer accounts",
    path: "/admin/users",
  },
];
