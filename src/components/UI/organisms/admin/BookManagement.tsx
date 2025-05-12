import { useEffect, useState } from "react";
import axios from "axios";
import API from "../../../../const/api_paths";
import type { Book } from "../../../../types/book";
import AddBook from "../../molecules/modals/AddBook";

export default function BookManagement() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<{ [id: number]: string }>({});
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [sortmethod, setSortMethod] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
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


  useEffect(()=>{
    setSelectedCategoryId("");
    setSearchTerm("");
  },[sortmethod])

    useEffect(()=>{
    setSelectedCategoryId("");
    setSortMethod("");
  },[searchTerm])

      useEffect(()=>{
    setSearchTerm("");
    setSortMethod("");
  },[selectedCategoryId])

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    axios
      .delete(`${API.DELETE_PRODUCT}/${id}`, { withCredentials: true })
      .then(() => fetchPaginatedBooks())
      .catch(() => alert("Delete failed"));
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Book Management</h2>
        <button
          className="bg-primary text-white px-4 py-2 rounded hover:bg-orange-700"
          onClick={() => setShowModal(true)}
        >
          + Add Book
        </button>
      </div>

      <div className="flex gap-4 mb-4">
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
          <table className="w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="bg-orange-100 text-left">
                <th className="border px-3 py-2">ID</th>
                <th className="border px-3 py-2">Image</th>
                <th className="border px-3 py-2">Title</th>
                <th className="border px-3 py-2">Description</th>
                <th className="border px-3 py-2">Price</th>
                <th className="border px-3 py-2">Stock</th>
                <th className="border px-3 py-2">Category</th>
                <th className="border px-3 py-2">Added date</th>
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => {
                const createdDate = new Date(book.created_at).toLocaleString(); // Format for display
                return (
                  <tr key={book.id} className="hover:bg-orange-50">
                    <td className="border px-3 py-2">{book.id}</td>
                    <td className="border px-3 py-2">
                      <img
                        src={book.imageUrl}
                        alt={book.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                    </td>
                    <td className="border px-3 py-2 font-semibold">
                      {book.title}
                    </td>
                    <td className="border px-3 py-2 max-w-xs">
                      {book.description}
                    </td>
                    <td className="border px-3 py-2">
                      ${book.price.toFixed(2)}
                    </td>
                    <td className="border px-3 py-2">{book.stock}</td>
                    <td className="border px-3 py-2">
                      {categories[book.category_id] || "Unknown"}
                    </td>
                    <td className="border px-3 py-2">{createdDate}</td>
                    <td className="border px-3 py-2">
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleDelete(book.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

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

      {showModal && (
        <AddBook
          onClose={() => setShowModal(false)}
          onSuccess={fetchPaginatedBooks}
        />
      )}
    </div>
  );
}
