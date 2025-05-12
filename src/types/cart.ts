import type { Book } from "./book";

export type CartItem = {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  added_at: string;
  product: Book;
};