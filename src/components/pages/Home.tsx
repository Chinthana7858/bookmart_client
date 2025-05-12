import { useEffect, useState } from "react";
import axios from "axios";
import type { Book } from "../../types/book";
import API from "../../const/api_paths";
import BookItem from "../UI/atoms/BookItem";
import Navbar from "../templates/Navbar";
import { Link } from "react-router-dom";
import Footer from "../templates/Footer";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<{ [id: number]: string }>({});
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [sortmethod, setSortMethod] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [thispage, setThispage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 10;

  const fetchPaginatedBooks = () => {
    const offset = (thispage - 1) * limit;

    axios
      .get(API.GET_PAGINATED_PRODUCTS(limit, offset), {
        withCredentials: true,
      })
      .then((res) => {
        setBooks(res.data.products);
        setTotal(res.data.total);
      })
      .catch((err) => console.error("Failed to fetch books:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPaginatedBooks();
  }, [thispage]);

  useEffect(() => {
    axios
      .get(API.GET_CATEGORIES, { withCredentials: true })
      .then((res) => {
        const map: { [id: number]: string } = {};
        res.data.forEach((cat: { id: number; name: string }) => {
          map[cat.id] = cat.name;
        });
        setCategories(map);
      })
      .catch(() => alert("Failed to load categories"));
  }, []);

  useEffect(() => {
    setLoading(true);

    const offset = (thispage - 1) * limit;

    // SORTING
    if (sortmethod) {
      const [sortBy, order] = sortmethod.split("-");
      axios
        .get(API.SORT_PRODUCTS(sortBy, order), {
          withCredentials: true,
        })
        .then((res) => {
          setBooks(res.data.products || res.data);
          setTotal(res.data.total || res.data.length);
        })
        .catch((err) => {
          console.error("Failed to fetch sorted books:", err);
        })
        .finally(() => setLoading(false));
    }

    // CATEGORY FILTER
    else if (selectedCategoryId) {
      axios
        .get(API.GET_PRODUCTS_BY_CATEGORY(Number(selectedCategoryId)), {
          withCredentials: true,
        })
        .then((res) => {
          setBooks(res.data);
          setTotal(res.data.length);
        })
        .catch((err) =>
          console.error("Failed to fetch books by category:", err)
        )
        .finally(() => setLoading(false));
    }

    // SEARCH
    else if (searchTerm.trim()) {
      axios
        .get(API.SEARCH_PRODUCTS(searchTerm), {
          withCredentials: true,
        })
        .then((res) => {
          setBooks(res.data.products || res.data);
          setTotal(res.data.total || res.data.length);
        })
        .catch((err) => console.error("Search failed:", err))
        .finally(() => setLoading(false));
    }

    // PAGINATION DEFAULT
    else {
      axios
        .get(API.GET_PAGINATED_PRODUCTS(limit, offset), {
          withCredentials: true,
        })
        .then((res) => {
          setBooks(res.data.products);
          setTotal(res.data.total);
        })
        .catch((err) => console.error("Paginated fetch failed:", err))
        .finally(() => setLoading(false));
    }
  }, [thispage, searchTerm, selectedCategoryId, sortmethod]);

  useEffect(() => {
    setSelectedCategoryId("");
    setSearchTerm("");
  }, [sortmethod]);

  useEffect(() => {
    setSelectedCategoryId("");
    setSortMethod("");
  }, [searchTerm]);

  useEffect(() => {
    setSearchTerm("");
    setSortMethod("");
  }, [selectedCategoryId]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="">
      <Navbar/>
      <div className=" p-8">

   
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Books</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setThispage(1);
          }}
          className="px-3 py-2 border rounded border-gray-300 "
        />
        <select
          value={selectedCategoryId}
          onChange={(e) => {
            setSelectedCategoryId(e.target.value);
            setThispage(1);
          }}
          className="px-1 py-2 border rounded border-gray-300 text-gray-500"
        >
          <option value="" className="">
            All Categories
          </option>
          {Object.entries(categories).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={sortmethod}
          onChange={(e) => {
            const value = e.target.value;
            setSortMethod(value);
          }}
          className="px-4 py-2 border border-gray-300 rounded shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="stock-asc">Stock: Low to High</option>
          <option value="stock-desc">Stock: High to Low</option>
          <option value="created_at-asc">Date: Oldest First</option>
          <option value="created_at-desc">Date: Newest First</option>
        </select>
      </div>

      {loading ? (
        <p>Loading books...</p>
      ) : books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {books.map((book) => (

              <Link to={`/book/${book.id}`}>
              <BookItem
                key={book.id}
                imageUrl={book.imageUrl}
                title={book.title}
                description={book.description}
                price={book.price}
                id={book.id}
                stock={book.stock}
                category_id={book.category_id}
                created_at={new Date(book.created_at)}
              /></Link>
            ))}
          </div>

          <div className="flex justify-center mt-4 gap-2">
            <button
              disabled={thispage === 1}
              onClick={() => setThispage(thispage - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-1 text-sm">
              Page {thispage} of {totalPages}
            </span>
            <button
              disabled={thispage === totalPages}
              onClick={() => setThispage(thispage + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>  <Footer />  </div>
  );
}
