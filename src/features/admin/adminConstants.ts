export const ADMIN_PAGE_SIZE = 10;

export const ADMIN_TAB_IDS = {
  dashboard: "dashboard",
  books: "books",
  categories: "categories",
  orders: "orders",
  users: "users",
} as const;

export type AdminTabId = (typeof ADMIN_TAB_IDS)[keyof typeof ADMIN_TAB_IDS];
