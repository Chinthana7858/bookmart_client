import { useEffect, useMemo, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import type { Book } from "../../../../types/book";
import BookItem from "../../atoms/BookItem";
import Navbar from "../../../templates/Navbar";
import Footer from "../../../templates/Footer";
import LoadingSpinner from "../../atoms/LoadingSpinner";
import { DropdownSelect, SearchBar } from "../../atoms/FormControls";
import {
  useGetCategoriesQuery,
  useGetPaginatedProductsQuery,
  useGetProductsByCategoryQuery,
  useSearchProductsQuery,
  useSortProductsQuery,
} from "../../../../services/bookmartApi";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<{ [id: number]: string }>({});
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [sortmethod, setSortMethod] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [thispage, setThispage] = useState(1);

  const limit = 12;
  const offset = (thispage - 1) * limit;
  const [sortBy, order] = sortmethod ? sortmethod.split("-") : ["", ""];
  const { data: categoryData, isError: categoriesFailed } = useGetCategoriesQuery();
  const paginatedQuery = useGetPaginatedProductsQuery(
    !sortmethod && !selectedCategoryId && !searchTerm.trim()
      ? { limit, offset }
      : skipToken
  );
  const sortQuery = useSortProductsQuery(
    sortmethod ? { sortBy, order } : skipToken
  );
  const categoryQuery = useGetProductsByCategoryQuery(
    selectedCategoryId ? Number(selectedCategoryId) : skipToken
  );
  const searchQuery = useSearchProductsQuery(
    searchTerm.trim() ? searchTerm : skipToken
  );

  useEffect(() => {
    if (categoryData) {
      const map: { [id: number]: string } = {};
      categoryData.forEach((cat) => {
        map[cat.id] = cat.name;
      });
      setCategories(map);
    }
  }, [categoryData]);

  useEffect(() => {
    if (categoriesFailed) alert("Failed to load categories");
  }, [categoriesFailed]);

  const activeQuery = sortmethod
    ? sortQuery
    : selectedCategoryId
      ? categoryQuery
      : searchTerm.trim()
        ? searchQuery
        : paginatedQuery;

  const { visibleBooks, total } = useMemo(() => {
    const data = activeQuery.data;
    if (!data) return { visibleBooks: [] as Book[], total: 0 };

    if (Array.isArray(data)) {
      return {
        visibleBooks: data.slice(offset, offset + limit),
        total: data.length,
      };
    }

    const products = "products" in data ? data.products : [];
    const productTotal = "total" in data ? data.total : products.length;
    const shouldSlice = Boolean(sortmethod || selectedCategoryId || searchTerm.trim());

    return {
      visibleBooks: shouldSlice ? products.slice(offset, offset + limit) : products,
      total: productTotal,
    };
  }, [activeQuery.data, limit, offset, searchTerm, selectedCategoryId, sortmethod]);

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

  useEffect(() => {
    setBooks(visibleBooks);
  }, [visibleBooks]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const loading = activeQuery.isLoading || activeQuery.isFetching;

  return (
    <div className="min-h-screen bg-light">
      <Navbar />

      <main className="page-container py-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Catalogue
            </p>
            <h1 className="text-2xl font-bold text-stone-950">Books</h1>
          </div>
          <p className="text-sm text-stone-500">{total} titles available</p>
        </div>

        <div className="surface mb-8 p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px]">
            <SearchBar
              placeholder="Search by title"
              value={searchTerm}
              onChange={(value) => {
                setSearchTerm(value);
                setThispage(1);
              }}
            />

            <DropdownSelect
              label="All categories"
              value={selectedCategoryId}
              onChange={(value) => {
                setSelectedCategoryId(value);
                setThispage(1);
              }}
              options={[
                { label: "All categories", value: "" },
                ...Object.entries(categories).map(([id, name]) => ({
                  label: name,
                  value: id,
                })),
              ]}
            />

            <DropdownSelect
              label="Sort by"
              value={sortmethod}
              onChange={setSortMethod}
              options={[
                { label: "Sort by", value: "" },
                { label: "Price: Low to High", value: "price-asc" },
                { label: "Price: High to Low", value: "price-desc" },
                { label: "Stock: Low to High", value: "stock-asc" },
                { label: "Stock: High to Low", value: "stock-desc" },
                { label: "Date: Oldest First", value: "created_at-asc" },
                { label: "Date: Newest First", value: "created_at-desc" },
              ]}
            />
          </div>
        </div>

        {loading ? (
          <div className="py-16">
            <LoadingSpinner />
          </div>
        ) : books.length === 0 ? (
          <div className="surface py-16 text-center text-stone-500">
            No books found.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {books.map((book) => (
                <BookItem key={book.id} {...book} created_at={new Date(book.created_at)} />
              ))}
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                disabled={thispage === 1}
                onClick={() => setThispage(thispage - 1)}
                className="btn-secondary h-10"
              >
                Prev
              </button>
              <span className="min-w-28 text-center text-sm font-medium text-stone-600">
                Page {thispage} of {totalPages}
              </span>
              <button
                disabled={thispage === totalPages}
                onClick={() => setThispage(thispage + 1)}
                className="btn-secondary h-10"
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
