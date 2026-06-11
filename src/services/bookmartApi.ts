import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Book } from "../types/book";
import type { CartItem } from "../types/cart";
import type { Category } from "../types/category";
import type { Order } from "../types/order";
import type {
  SignInFormData,
  SignUpFormData,
  User,
  UserAddress,
  UserAddressInput,
  UserProfileUpdate,
} from "../types/user";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "https://bookmart-be.onrender.com";

export type PaginatedBooks = {
  products: Book[];
  total: number;
};

export type PaginatedCategories = {
  categories: Category[];
  total: number;
};

export type PaginatedOrders = {
  orders: Order[];
  total: number;
};

export type OrderQueryParams = {
  skip: number;
  limit: number;
  search?: string;
  status?: string;
  payment_status?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
};

export type PaginatedUsers = {
  users: User[];
  total: number;
};

export type PaymentSession = {
  provider: string;
  order_id: number;
  amount: number;
  currency: string;
  payment_url: string;
  session_id: string;
};

export type DashboardBreakdownItem = {
  key: string;
  label: string;
  count: number;
};

export type DashboardRecentOrder = {
  id: number;
  customer_name: string;
  customer_email: string;
  order_date: string;
  status: string;
  payment_status: string;
  total_amount: number;
  item_count: number;
};

export type DashboardProductSummary = {
  id: number;
  title: string;
  stock: number;
  price: number;
  imageUrl?: string | null;
  author?: string | null;
  sold_quantity?: number | null;
  revenue?: number | null;
};

export type DashboardCategorySummary = {
  id: number;
  name: string;
  product_count: number;
  sold_quantity: number;
};

export type AdminDashboardSummary = {
  total_revenue: number;
  revenue_today: number;
  revenue_this_month: number;
  total_orders: number;
  total_books: number;
  total_customers: number;
  total_admins: number;
  average_order_value: number;
  paid_orders: number;
  unpaid_orders: number;
  pending_orders: number;
  low_stock_count: number;
  out_of_stock_count: number;
  unpaid_amount: number;
  order_status_breakdown: DashboardBreakdownItem[];
  payment_status_breakdown: DashboardBreakdownItem[];
  recent_orders: DashboardRecentOrder[];
  unpaid_recent_orders: DashboardRecentOrder[];
  low_stock_books: DashboardProductSummary[];
  top_selling_books: DashboardProductSummary[];
  top_categories: DashboardCategorySummary[];
};

type AuthToken = {
  access_token?: string;
  token_type?: string;
};

export const getApiErrorMessage = (error: unknown, fallback = "Something went wrong.") => {
  if (
    error &&
    typeof error === "object" &&
    "data" in error &&
    error.data &&
    typeof error.data === "object" &&
    "detail" in error.data
  ) {
    const detail = error.data.detail;
    return typeof detail === "string" ? detail : fallback;
  }

  return fallback;
};

export const bookmartApi = createApi({
  reducerPath: "bookmartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Auth", "Book", "Cart", "Category", "Order", "User"],
  endpoints: (builder) => ({
    getAdminDashboardSummary: builder.query<AdminDashboardSummary, void>({
      query: () => "/admin/dashboard/summary",
      providesTags: ["Order", "Book", "User", "Category"],
    }),
    authenticate: builder.query<User, void>({
      query: () => "/auth/authenticate",
      providesTags: ["Auth"],
    }),
    login: builder.mutation<AuthToken, SignInFormData>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    register: builder.mutation<AuthToken, SignUpFormData & { role?: "user" | "admin" }>({
      query: (body) => ({
        url: "/auth/signup",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth", "User"],
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth", "Cart", "Order"],
    }),

    getCategories: builder.query<Category[], void>({
      query: () => "/categories/",
      providesTags: ["Category"],
    }),
    getCategoriesPaginated: builder.query<PaginatedCategories, { skip: number; limit: number }>({
      query: ({ skip, limit }) => ({
        url: "/categories/paginated",
        params: { skip, limit },
      }),
      providesTags: ["Category"],
    }),
    addCategory: builder.mutation<Category, Pick<Category, "name" | "description">>({
      query: (body) => ({
        url: "/categories/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation<
      Category,
      { id: number; body: Partial<Pick<Category, "name" | "description">> }
    >({
      query: ({ id, body }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Category", "Book"],
    }),
    deleteCategory: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category", "Book"],
    }),

    getPaginatedProducts: builder.query<PaginatedBooks, { limit: number; offset: number }>({
      query: ({ limit, offset }) => ({
        url: "/products/paginated",
        params: { limit, offset },
      }),
      providesTags: ["Book"],
    }),
    searchProducts: builder.query<PaginatedBooks | Book[], string>({
      query: (name) => ({
        url: "/products/search",
        params: { name },
      }),
      providesTags: ["Book"],
    }),
    getProductsByCategory: builder.query<Book[], number>({
      query: (categoryId) => `/products/getbycategoryid/${categoryId}`,
      providesTags: ["Book"],
    }),
    sortProducts: builder.query<PaginatedBooks | Book[], { sortBy: string; order: string }>({
      query: ({ sortBy, order }) => ({
        url: "/products/sorted",
        params: { sort_by: sortBy, order },
      }),
      providesTags: ["Book"],
    }),
    getProductById: builder.query<Book, number>({
      query: (id) => `/products/getproductbyid/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Book", id }],
    }),
    getPopularProducts: builder.query<Book[], void>({
      query: () => "/activities/top-viewed-details",
      providesTags: ["Book"],
    }),
    getRecommendedProducts: builder.query<Book[], number>({
      query: (id) => `/recommendations/${id}`,
      providesTags: ["Book"],
    }),
    addProduct: builder.mutation<Book, FormData>({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Book"],
    }),
    updateProduct: builder.mutation<Book, { id: number; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Book"],
    }),
    deleteProduct: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Book"],
    }),

    createActivity: builder.mutation<
      unknown,
      { user_id?: number; product_id: number; action: "view" | "buy" | "add_to_cart" }
    >({
      query: (body) => ({
        url: "/activities/",
        method: "POST",
        body,
      }),
    }),

    addToCart: builder.mutation<CartItem, { product_id: number; quantity: number }>({
      query: (body) => ({
        url: "/cart/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart", "Book"],
    }),
    getMyCartItems: builder.query<CartItem[], void>({
      query: () => "/cart/me",
      providesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation<CartItem, { id: number; quantity: number }>({
      query: ({ id, quantity }) => ({
        url: `/cart/${id}`,
        method: "PUT",
        body: { quantity },
      }),
      invalidatesTags: ["Cart", "Book"],
    }),
    removeCartItem: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/cart/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart", "Book"],
    }),

    createOrder: builder.mutation<Order, void>({
      query: () => ({
        url: "/orders/",
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["Order"],
    }),
    createOrderItem: builder.mutation<
      unknown,
      { order_id: number; product_id: number; quantity: number }
    >({
      query: (body) => ({
        url: "/orders/items/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order", "Book"],
    }),
    checkoutCart: builder.mutation<Order, void>({
      query: () => ({
        url: "/orders/checkout",
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["Cart", "Order", "Book"],
    }),
    getMyOrders: builder.query<Order[], void>({
      query: () => "/orders/me",
      providesTags: ["Order"],
    }),
    getOrderById: builder.query<Order, number>({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _error, id) => ["Order", { type: "Order", id }],
    }),
    getOrdersPaginated: builder.query<PaginatedOrders, OrderQueryParams>({
      query: ({ skip, limit, search, status, payment_status, sort_by, sort_order }) => ({
        url: "/orders/paginated",
        params: {
          skip,
          limit,
          search: search || undefined,
          status: status || undefined,
          payment_status: payment_status || undefined,
          sort_by,
          sort_order,
        },
      }),
      providesTags: ["Order"],
    }),
    updateOrderStatus: builder.mutation<
      Order,
      { id: number; status?: string; payment_status?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/orders/${id}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => ["Order", { type: "Order", id }],
    }),

    getUsersPaginated: builder.query<
      PaginatedUsers,
      { skip: number; limit: number; role?: "user" | "admin" }
    >({
      query: ({ skip, limit, role }) => ({
        url: "/users/paginated",
        params: { skip, limit, role },
      }),
      providesTags: ["User"],
    }),
    getUserById: builder.query<User, number>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => ["User", { type: "User", id }],
    }),
    getOrdersByUser: builder.query<Order[], number>({
      query: (id) => `/orders/user/${id}`,
      providesTags: (_result, _error, id) => ["Order", { type: "Order", id }],
    }),
    getMyProfile: builder.query<User, void>({
      query: () => "/users/me/profile",
      providesTags: ["User"],
    }),
    updateMyProfile: builder.mutation<User, UserProfileUpdate>({
      query: (body) => ({
        url: "/users/me/profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User", "Auth"],
    }),
    getMyAddresses: builder.query<UserAddress[], void>({
      query: () => "/users/me/addresses",
      providesTags: ["User"],
    }),
    addMyAddress: builder.mutation<UserAddress, UserAddressInput>({
      query: (body) => ({
        url: "/users/me/addresses",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    updateMyAddress: builder.mutation<
      UserAddress,
      { id: number; body: Partial<UserAddressInput> }
    >({
      query: ({ id, body }) => ({
        url: `/users/me/addresses/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    deleteMyAddress: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/users/me/addresses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    createPaymentSession: builder.mutation<PaymentSession, { order_id: number }>({
      query: (body) => ({
        url: "/payments/checkout-session",
        method: "POST",
        body,
      }),
    }),
    confirmPayment: builder.mutation<Order, { orderId: number; session_id?: string } | number>({
      query: (payload) => {
        const orderId = typeof payload === "number" ? payload : payload.orderId;
        const sessionId = typeof payload === "number" ? undefined : payload.session_id;
        return {
        url: `/payments/orders/${orderId}/confirm`,
        method: "POST",
        body: sessionId ? { session_id: sessionId } : {},
        };
      },
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useAddCategoryMutation,
  useAddMyAddressMutation,
  useAddProductMutation,
  useAddToCartMutation,
  useAuthenticateQuery,
  useCheckoutCartMutation,
  useConfirmPaymentMutation,
  useCreateActivityMutation,
  useCreateOrderItemMutation,
  useCreateOrderMutation,
  useCreatePaymentSessionMutation,
  useDeleteCategoryMutation,
  useDeleteMyAddressMutation,
  useDeleteProductMutation,
  useGetAdminDashboardSummaryQuery,
  useGetCategoriesPaginatedQuery,
  useGetCategoriesQuery,
  useGetMyCartItemsQuery,
  useGetMyAddressesQuery,
  useGetMyOrdersQuery,
  useGetMyProfileQuery,
  useGetOrderByIdQuery,
  useGetOrdersPaginatedQuery,
  useGetPaginatedProductsQuery,
  useGetPopularProductsQuery,
  useGetProductByIdQuery,
  useGetProductsByCategoryQuery,
  useGetRecommendedProductsQuery,
  useGetOrdersByUserQuery,
  useGetUserByIdQuery,
  useGetUsersPaginatedQuery,
  useLazyAuthenticateQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useRemoveCartItemMutation,
  useSearchProductsQuery,
  useSortProductsQuery,
  useUpdateCategoryMutation,
  useUpdateCartItemMutation,
  useUpdateMyAddressMutation,
  useUpdateMyProfileMutation,
  useUpdateOrderStatusMutation,
  useUpdateProductMutation,
} = bookmartApi;
