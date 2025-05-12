import type { Book } from "./book";
import type { User } from "./user";

export type OrderItem = {
  id: number;
  quantity: number;
  product: Book;
};

export type Order = {
  id: number;
  user_id: number;
   user: User;
  order_date: string;
  items: OrderItem[];
};