import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import { FiPlus } from "react-icons/fi";
import type { Book } from "../../../../types/book";
import LoadingSpinner from "../../atoms/LoadingSpinner";
import { DropdownSelect, SearchBar } from "../../atoms/FormControls";
import PaginationControls from "../../atoms/PaginationControls";
import { formatDisplayDate } from "../../../../utils/date";
import { ADMIN_PAGE_SIZE } from "../../../../features/admin/adminConstants";
import AddBook from "../../molecules/modals/AddBook";
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import {
  useGetCategoriesQuery,
  useGetPaginatedProductsQuery,
  useGetProductsByCategoryQuery,
  useSearchProductsQuery,
  useSortProductsQuery,
} from "../../../../services/bookmartApi";

export default function BookManagement() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<{ [id: number]: string }>({});
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [sortmethod, setSortMethod] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [thispage, setThispage] = useState(1);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const offset = (thispage - 1) * ADMIN_PAGE_SIZE;
  const [sortBy, order] = sortmethod ? sortmethod.split("-") : ["", ""];
  const { data: categoryData, isError: categoriesFailed } = useGetCategoriesQuery();
  const paginatedQuery = useGetPaginatedProductsQuery(
    !sortmethod && !selectedCategoryId && !searchTerm.trim()
      ? { limit: ADMIN_PAGE_SIZE, offset }
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
        visibleBooks: data.slice(offset, offset + ADMIN_PAGE_SIZE),
        total: data.length,
      };
    }

    const products = "products" in data ? data.products : [];
    const productTotal = "total" in data ? data.total : products.length;
    const shouldSlice = Boolean(sortmethod || selectedCategoryId || searchTerm.trim());

    return {
      visibleBooks: shouldSlice
        ? products.slice(offset, offset + ADMIN_PAGE_SIZE)
        : products,
      total: productTotal,
    };
  }, [activeQuery.data, offset, searchTerm, selectedCategoryId, sortmethod]);


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

  useEffect(() => {
    setBooks(visibleBooks);
  }, [visibleBooks]);

  const totalPages = Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE));
  const loading = activeQuery.isLoading || activeQuery.isFetching;
  const getBookCategoryNames = (book: Book) => {
    if (book.categories?.length) return book.categories.map((category) => category.name);
    const categoryIds = book.category_ids?.length ? book.category_ids : [book.category_id];
    return categoryIds.map((id) => categories[id]).filter(Boolean);
  };

  return (
    <div>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-stone-950">Inventory</h2>
          <p className="mt-1 text-sm text-stone-500">
            Review catalogue stock, pricing, and publishing data. Open a book to manage its details.
          </p>
        </div>
        <button
          type="button"
          className="btn-primary w-fit cursor-pointer"
          onClick={() => setShowAddBookModal(true)}
        >
          <FiPlus size={16} />
          Add Book
        </button>
      </div>

      <div className="surface mb-5 grid gap-3 p-4 lg:grid-cols-[1fr_220px_220px]">
        <SearchBar
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(value) => {
            setSearchTerm(value);
            setThispage(1);
          }}
        />
        <DropdownSelect
          label="All Categories"
          value={selectedCategoryId}
          onChange={(value) => {
            setSelectedCategoryId(value);
            setThispage(1); 
          }}
          options={[
            { label: "All Categories", value: "" },
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

      {loading ? (
        <LoadingSpinner />
      ) : books.length === 0 ? (
        <div className="surface py-12 text-center text-stone-500">No books found.</div>
      ) : (
        <>
          <div className="bookmart-table overflow-x-auto sm:rounded-lg">
          <Table hoverable>
            <TableHead>
              <TableRow>
                <TableHeadCell>ID</TableHeadCell>
                <TableHeadCell>Image</TableHeadCell>
                <TableHeadCell>Title</TableHeadCell>
                <TableHeadCell>Author</TableHeadCell>
                <TableHeadCell>Publisher</TableHeadCell>
                <TableHeadCell>Language</TableHeadCell>
                <TableHeadCell>Price</TableHeadCell>
                <TableHeadCell>Stock</TableHeadCell>
                <TableHeadCell>Categories</TableHeadCell>
                <TableHeadCell>Added date</TableHeadCell>
                <TableHeadCell>Action</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {books.map((book) => {
                const createdDate = formatDisplayDate(book.created_at);
                return (
                  <TableRow
                    key={book.id}
                    className="cursor-pointer bg-white"
                    onClick={() => navigate(`/admin/inventory/${book.id}`)}
                  >
                    <TableCell>{book.id}</TableCell>
                    <TableCell>
                      <img
                        src={book.imageUrl}
                        alt={book.title}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {book.title}
                    </TableCell>
                    <TableCell>{book.author || "Unknown"}</TableCell>
                    <TableCell>{book.publisher || "Unknown"}</TableCell>
                    <TableCell>{book.language || "Unknown"}</TableCell>
                    <TableCell className="font-semibold text-gray-900">
                      ${book.price.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge color={book.stock > 0 ? "warning" : "failure"} className="w-fit">
                        {book.stock}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex max-w-56 flex-wrap gap-1.5">
                        {getBookCategoryNames(book).length > 0 ? (
                          getBookCategoryNames(book).map((name) => (
                            <Badge key={name} color="warning" className="w-fit">
                              {name}
                            </Badge>
                          ))
                        ) : (
                          "Unknown"
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{createdDate}</TableCell>
                    <TableCell>
                      <button
                        type="button"
                        className="cursor-pointer font-semibold text-primary transition hover:text-primarydark hover:underline"
                        onClick={(event) => {
                          event.stopPropagation();
                          navigate(`/admin/inventory/${book.id}`);
                        }}
                      >
                        View
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          </div>

          <PaginationControls
            currentPage={thispage}
            totalPages={totalPages}
            onPageChange={setThispage}
            previousLabel="Prev"
            className="justify-center gap-2"
          />
        </>
      )}

      {showAddBookModal && (
        <AddBook
          onClose={() => setShowAddBookModal(false)}
          onSuccess={() => {
            setThispage(1);
          }}
        />
      )}
    </div>
  );
}
