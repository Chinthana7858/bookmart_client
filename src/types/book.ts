export interface Book {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  created_at:Date
  imageUrl: string;
}
