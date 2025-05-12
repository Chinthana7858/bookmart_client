import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import API from "../../const/api_paths";
import type { Book } from "../../types/book";
import BookDetails from "../templates/BookDetails";
import BookItem from "../UI/atoms/BookItem";
import Navbar from "../templates/Navbar";
import Footer from "../templates/Footer";

export default function BookRecommend() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [recommended, setRecommended] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{ [id: number]: string }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookRes = await axios.get(API.GET_PRODUCT_BY_ID(Number(id)), {
          withCredentials: true,
        });
        setBook(bookRes.data);
      } catch (err) {
        console.error("Failed to fetch book details", err);
        setLoading(false);
        return;
      }

      try {
        const recRes = await axios.get(
          API.GET_RECOMMENDED_PRODUCTS(Number(id)),
          {
            withCredentials: true,
          }
        );
        setRecommended(recRes.data);
      } catch (err) {
        console.warn("Failed to fetch recommended books", err);
      }

      try {
        // Fetch categories
        const catRes = await axios.get(API.GET_CATEGORIES, {
          withCredentials: true,
        });
        const catMap: { [id: number]: string } = {};
        catRes.data.forEach((cat: { id: number; name: string }) => {
          catMap[cat.id] = cat.name;
        });
        setCategories(catMap);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!book) return <p className="p-6">Book not found.</p>;

  return (
    <div className="">
      <Navbar />
      <div className=" p-5">
        <BookDetails
          {...book}
          categoryName={categories[book.category_id] || "Unknown"}
        />

        <div className="mt-10 lg:px-10">
          <h3 className="text-lg font-semibold mb-4 p-2">
            Recommanded for you
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {recommended.map((recBook) => (
              <div key={recBook.id} className="text-center">
                <Link to={`/book/${recBook.id}`}>
                  <BookItem
                    id={recBook.id}
                    title={recBook.title}
                    description={recBook.description}
                    price={recBook.price}
                    stock={recBook.stock}
                    category_id={recBook.category_id}
                    created_at={new Date(recBook.created_at)}
                    imageUrl={recBook.imageUrl}
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>{" "}
      <Footer />{" "}
    </div>
  );
}
