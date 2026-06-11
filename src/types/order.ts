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
  status: string;
  payment_status: string;
  total_amount: number;
  items: OrderItem[];
};
