import type { Category } from "./category";

export interface Book {
  id: number;
  title: string;
  description: string;
  publisher?: string | null;
  author?: string | null;
  language?: string | null;
  price: number;
  stock: number;
  category_id: number;
  category_ids?: number[];
  categories?: Category[];
  created_at:Date
  imageUrl: string;
}
