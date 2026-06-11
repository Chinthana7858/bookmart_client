import { lazy, type ComponentType } from "react";

const AuthRedirect = lazy(() => import("../components/pages/public/AuthRedirect"));
const BookRecommend = lazy(() => import("../components/pages/public/BookRecommend"));
const Cart = lazy(() => import("../components/pages/customer/Cart"));
const Home = lazy(() => import("../components/pages/public/Home"));
const LandingPage = lazy(() => import("../components/pages/public/LandingPage"));
const Orders = lazy(() => import("../components/pages/customer/Orders"));
const Payment = lazy(() => import("../components/pages/customer/Payment"));
const ProfileManagement = lazy(
  () => import("../components/pages/customer/ProfileManagement")
);
const SignIn = lazy(() => import("../components/pages/public/SignIn"));
const SignUp = lazy(() => import("../components/pages/public/SignUp"));
const AdminDashboard = lazy(() => import("../components/pages/admin/AdminDashboard"));
const AdminBooksPage = lazy(() => import("../components/pages/admin/AdminBooksPage"));
const AdminBookDetailsPage = lazy(
  () => import("../components/pages/admin/AdminBookDetailsPage")
);
const AdminCategoriesPage = lazy(
  () => import("../components/pages/admin/AdminCategoriesPage")
);
const AdminInventoryPage = lazy(() => import("../components/pages/admin/AdminInventoryPage"));
const AdminOrderDetailsPage = lazy(
  () => import("../components/pages/admin/AdminOrderDetailsPage")
);
const AdminOrdersPage = lazy(() => import("../components/pages/admin/AdminOrdersPage"));
const AdminUserDetailsPage = lazy(
  () => import("../components/pages/admin/AdminUserDetailsPage")
);
const AdminUsersPage = lazy(() => import("../components/pages/admin/AdminUsersPage"));

export type AppRoute = {
  path: string;
  Component: ComponentType;
};

export const publicRoutes: AppRoute[] = [
  { path: "/", Component: LandingPage },
  { path: "/signup", Component: SignUp },
  { path: "/signin", Component: SignIn },
  { path: "/authredirect", Component: AuthRedirect },
  { path: "/home", Component: Home },
  { path: "/book/:id", Component: BookRecommend },
];

export const protectedRoutes: AppRoute[] = [
  { path: "/cart", Component: Cart },
  { path: "/orders", Component: Orders },
  { path: "/payment/:orderId", Component: Payment },
  { path: "/profile", Component: ProfileManagement },
];

export const adminRoutes: AppRoute[] = [
  { path: "/admin/dashboard", Component: AdminDashboard },
  { path: "/admin/books", Component: AdminBooksPage },
  { path: "/admin/inventory", Component: AdminInventoryPage },
  { path: "/admin/inventory/:bookId", Component: AdminBookDetailsPage },
  { path: "/admin/categories", Component: AdminCategoriesPage },
  { path: "/admin/orders", Component: AdminOrdersPage },
  { path: "/admin/orders/:orderId", Component: AdminOrderDetailsPage },
  { path: "/admin/users", Component: AdminUsersPage },
  { path: "/admin/users/:userId", Component: AdminUserDetailsPage },
];
