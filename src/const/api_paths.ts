const BASE_URL = "https://bookmart-be.onrender.com";

const API = {
  BASE_URL,

  // Auth
  LOGIN: `${BASE_URL}/auth/login`,
  REGISTER: `${BASE_URL}/auth/signup`,
  LOGOUT: `${BASE_URL}/auth/logout`,
  AUTHENTICATE: `${BASE_URL}/auth/authenticate`,

  //Categories
  GET_CATEGORIES: `${BASE_URL}/categories/`,
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
  CREATE_ORDER: `${BASE_URL}/orders`,
  CREATE_ORDER_ITEM: `${BASE_URL}/orders/items`,
  GET_ORDERS_BY_USER: (id: number) => `${BASE_URL}/orders/user/${id}`,
  GET_ORDERS:  `${BASE_URL}/orders/`,

  //CART
  ADD_TO_CART: `${BASE_URL}/cart`,
  GET_CART_ITEMS: (id: number) =>`${BASE_URL}/cart/cartbyuserid/${id}`,
  REMOVE_CART_ITEMS: (id: number) =>`${BASE_URL}/cart/${id}`,

  //Users
  GET_USERS:`${BASE_URL}/users/`

};

export default API;
