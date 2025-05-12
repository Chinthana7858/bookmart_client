import type { Book } from "../../../types/book";

export default function BookItem({ imageUrl, title, description, price }: Book) {
  return (
    <div className="w-40 text-sm font-sans cursor-pointer hover:scale-105 p-2">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-60 object-cover rounded shadow-sm"
      />
      <div className="mt-2">
        <p className="font-semibold">{title}</p>
        <p className="text-gray-600">{description}</p>
        <p className="text-primary font-semibold">$ {price}</p>
      </div>
    </div>
  );
}