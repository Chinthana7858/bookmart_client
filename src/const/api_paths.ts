const BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "https://bookmart-be.onrender.com";

const API = {
  BASE_URL,

  // Auth
  LOGIN: `${BASE_URL}/auth/login`,
  REGISTER: `${BASE_URL}/auth/signup`,
  LOGOUT: `${BASE_URL}/auth/logout`,
  AUTHENTICATE: `${BASE_URL}/auth/authenticate`,

  //Categories
  GET_CATEGORIES: `${BASE_URL}/categories/`,
  GET_CATEGORIES_PAGINATED: `${BASE_URL}/categories/paginated`,
  DELETE_CATEGORY: `${BASE_URL}/categories/`,
  ADD_CATEGORY: `${BASE_URL}/categories/`,

  // Products
  DELETE_PRODUCT: `${BASE_URL}/products`,
  ADD_PRODUCT: `${BASE_URL}/products`,
  GET_PAGINATED_PRODUCTS: (limit: number, offset: number) =>
    `${BASE_URL}/products/paginated?limit=${limit}&offset=${offset}`,
  SEARCH_PRODUCTS: (query: string) =>
    `${BASE_URL}/products/search?name=${query}`,
  GET_PRODUCTS_BY_CATEGORY: (categoryId: number) =>
    `${BASE_URL}/products/getbycategoryid/${categoryId}`,
  SORT_PRODUCTS: (sortBy: string, order: string) =>
    `${BASE_URL}/products/sorted?sort_by=${sortBy}&order=${order}`,
  GET_PRODUCT_BY_ID: (id: number) =>
    `${BASE_URL}/products/getproductbyid/${id}`,
  GET_POPULAR_PRODUCTS: `${BASE_URL}/activities/top-viewed-details`,
  GET_RECOMMENDED_PRODUCTS: (id: number) => `${BASE_URL}/recommendations/${id}`,

  //User activity
  CREATE_ACTIVITY: `${BASE_URL}/activities/`,

  //Order
  CREATE_ORDER: `${BASE_URL}/orders/`,
  CREATE_ORDER_ITEM: `${BASE_URL}/orders/items/`,
  CHECKOUT_CART: `${BASE_URL}/orders/checkout`,
  GET_MY_ORDERS: `${BASE_URL}/orders/me`,
  GET_ORDER_BY_ID: (id: number) => `${BASE_URL}/orders/${id}`,
  GET_ORDERS_BY_USER: (id: number) => `${BASE_URL}/orders/user/${id}`,
  GET_ORDERS:  `${BASE_URL}/orders/`,
  GET_ORDERS_PAGINATED:  `${BASE_URL}/orders/paginated`,
  UPDATE_ORDER_STATUS: (id: number) => `${BASE_URL}/orders/${id}/status`,

  //CART
  ADD_TO_CART: `${BASE_URL}/cart/`,
  GET_MY_CART_ITEMS: `${BASE_URL}/cart/me`,
  GET_CART_ITEMS: (id: number) =>`${BASE_URL}/cart/cartbyuserid/${id}`,
  UPDATE_CART_ITEM: (id: number) =>`${BASE_URL}/cart/${id}`,
  REMOVE_CART_ITEMS: (id: number) =>`${BASE_URL}/cart/${id}`,

  //Users
  GET_USERS:`${BASE_URL}/users/`,
  GET_USERS_PAGINATED:`${BASE_URL}/users/paginated`,

  //Payments
  CREATE_PAYMENT_SESSION: `${BASE_URL}/payments/checkout-session`,
  CONFIRM_PAYMENT: (orderId: number) => `${BASE_URL}/payments/orders/${orderId}/confirm`

};

export default API;
