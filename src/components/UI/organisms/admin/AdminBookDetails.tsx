import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import { Badge } from "flowbite-react";
import {
  FiArrowLeft,
  FiBookOpen,
  FiEdit2,
  FiPackage,
  FiSave,
  FiTag,
  FiUpload,
  FiX,
} from "react-icons/fi";
import LoadingSpinner from "../../atoms/LoadingSpinner";
import { CheckboxGroup } from "../../atoms/FormControls";
import ConfirmModal from "../../molecules/modals/ConfirmModal";
import {
  useGetCategoriesQuery,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../../../services/bookmartApi";
import { formatDisplayDate } from "../../../../utils/date";
import type { Book } from "../../../../types/book";

type BookEditForm = {
  title: string;
  description: string;
  publisher: string;
  author: string;
  language: string;
  price: string;
  stock: string;
  category_ids: string[];
};

function getInitialForm(book: Book): BookEditForm {
  return {
    title: book.title,
    description: book.description,
    publisher: book.publisher || "",
    author: book.author || "",
    language: book.language || "",
    price: String(book.price),
    stock: String(book.stock),
    category_ids: (book.category_ids?.length
      ? book.category_ids
      : [book.category_id]
    ).map(String),
  };
}

function getBookCategoryNames(book: Book, categoryMap: Record<number, string>) {
  if (book.categories?.length) {
    return book.categories.map((category) => category.name);
  }

  const categoryIds = book.category_ids?.length
    ? book.category_ids
    : [book.category_id];

  return categoryIds.map((id) => categoryMap[id]).filter(Boolean);
}

export default function AdminBookDetails() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const numericBookId = Number(bookId);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<BookEditForm | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const {
    data: book,
    isLoading,
    isError,
    refetch,
  } = useGetProductByIdQuery(numericBookId ? numericBookId : skipToken);
  const { data: categoryData = [] } = useGetCategoriesQuery();
  const [updateProduct, { isLoading: isSaving }] = useUpdateProductMutation();

  useEffect(() => {
    if (!book || isEditing) return;
    setFormData(getInitialForm(book));
    setImagePreview(book.imageUrl);
    setFile(null);
  }, [book, isEditing]);

  const categoryMap = useMemo(() => {
    return categoryData.reduce<Record<number, string>>((map, category) => {
      map[category.id] = category.name;
      return map;
    }, {});
  }, [categoryData]);

  const categoryNames = book ? getBookCategoryNames(book, categoryMap) : [];

  const updateField = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!formData) return;
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0];
    if (!nextFile) return;

    setFile(nextFile);
    setImagePreview(URL.createObjectURL(nextFile));
  };

  const startEditing = () => {
    if (!book) return;
    setFormData(getInitialForm(book));
    setImagePreview(book.imageUrl);
    setFile(null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    if (!book) return;
    setFormData(getInitialForm(book));
    setImagePreview(book.imageUrl);
    setFile(null);
    setShowSaveConfirm(false);
    setIsEditing(false);
  };

  const validateForm = () => {
    if (!formData) return false;
    const { title, description, price, stock, category_ids } = formData;

    if (!title || !description || !price || !stock || category_ids.length === 0) {
      alert("Title, description, price, stock, and category are required.");
      return false;
    }

    return true;
  };

  const requestSave = () => {
    if (validateForm()) setShowSaveConfirm(true);
  };

  const handleSave = async () => {
    if (!book || !formData || !validateForm()) return;

    const bookForm = new FormData();
    bookForm.append("title", formData.title);
    bookForm.append("description", formData.description);
    bookForm.append("publisher", formData.publisher);
    bookForm.append("author", formData.author);
    bookForm.append("language", formData.language);
    bookForm.append("price", formData.price);
    bookForm.append("stock", formData.stock);
    bookForm.append(
      "category_ids",
      JSON.stringify(formData.category_ids.map(Number))
    );
    if (file) bookForm.append("file", file);

    try {
      await updateProduct({ id: book.id, body: bookForm }).unwrap();
      setShowSaveConfirm(false);
      setIsEditing(false);
      setFile(null);
      refetch();
    } catch {
      alert("Failed to update book.");
    }
  };

  return (
    <>
      {isLoading && (
        <div className="p-8">
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && (isError || !book) && (
        <div className="surface p-8 text-center">
          <h1 className="text-xl font-semibold text-stone-950">
            Book not found
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            This inventory item may have been removed or is unavailable.
          </p>
          <button
            type="button"
            className="btn-primary mt-5"
            onClick={() => navigate("/admin/inventory")}
          >
            Back to inventory
          </button>
        </div>
      )}

      {book && formData && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <button
                type="button"
                className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-stone-200 bg-white text-stone-600 shadow-sm transition hover:border-primary hover:text-primary"
                onClick={() => navigate("/admin/inventory")}
                aria-label="Back to inventory"
              >
                <FiArrowLeft size={20} />
              </button>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  {isEditing ? (
                    <input
                      name="title"
                      value={formData.title}
                      onChange={updateField}
                      className="field min-w-72 text-2xl font-bold"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-stone-950">
                      {book.title}
                    </h1>
                  )}
                  <Badge color={Number(formData.stock) > 0 ? "warning" : "failure"}>
                    {Number(formData.stock) > 0 ? "In stock" : "Out of stock"}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-stone-500">
                  Inventory item #{book.id} · Added{" "}
                  {formatDisplayDate(book.created_at)}
                </p>
              </div>
            </div>

            {isEditing ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn-secondary h-10"
                  onClick={cancelEditing}
                  disabled={isSaving}
                >
                  <FiX size={16} />
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-primary h-10"
                  onClick={requestSave}
                  disabled={isSaving}
                >
                  <FiSave size={16} />
                  {isSaving ? "Saving..." : "Save changes"}
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn-primary h-10"
                onClick={startEditing}
              >
                <FiEdit2 size={16} />
                Edit item
              </button>
            )}
          </div>

          <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
            <section className="surface overflow-hidden">
              <img
                src={imagePreview || book.imageUrl}
                alt={book.title}
                className="h-[440px] w-full bg-stone-50 object-contain"
              />
              {isEditing && (
                <div className="border-t border-stone-200 p-4">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primarydark">
                    <FiUpload size={16} />
                    Replace image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </section>

            <div className="space-y-6">
              <section className="surface p-5">
                <div className="mb-4 flex items-center gap-2">
                  <FiBookOpen className="text-primary" />
                  <h2 className="text-lg font-semibold text-stone-950">
                    Book details
                  </h2>
                </div>
                {isEditing ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      name="author"
                      value={formData.author}
                      onChange={updateField}
                      className="field w-full"
                      placeholder="Author"
                    />
                    <input
                      name="publisher"
                      value={formData.publisher}
                      onChange={updateField}
                      className="field w-full"
                      placeholder="Publisher"
                    />
                    <input
                      name="language"
                      value={formData.language}
                      onChange={updateField}
                      className="field w-full"
                      placeholder="Language"
                    />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={updateField}
                      className="field w-full"
                      placeholder="Price"
                    />
                  </div>
                ) : (
                  <dl className="grid gap-4 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-stone-500">Author</dt>
                      <dd className="mt-1 font-semibold text-stone-950">
                        {book.author || "Not specified"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-stone-500">Publisher</dt>
                      <dd className="mt-1 font-semibold text-stone-950">
                        {book.publisher || "Not specified"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-stone-500">Language</dt>
                      <dd className="mt-1 font-semibold text-stone-950">
                        {book.language || "Not specified"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-stone-500">Price</dt>
                      <dd className="mt-1 font-semibold text-primary">
                        $ {Number(book.price).toFixed(2)}
                      </dd>
                    </div>
                  </dl>
                )}
              </section>

              <section className="surface p-5">
                <div className="mb-4 flex items-center gap-2">
                  <FiPackage className="text-primary" />
                  <h2 className="text-lg font-semibold text-stone-950">
                    Stock
                  </h2>
                </div>
                {isEditing ? (
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={updateField}
                    className="field max-w-xs"
                    placeholder="Stock"
                  />
                ) : (
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge color={book.stock > 0 ? "warning" : "failure"}>
                      {book.stock} units
                    </Badge>
                    <span className="text-sm text-stone-500">
                      Stock can be adjusted by editing this item.
                    </span>
                  </div>
                )}
              </section>

              <section className="surface p-5">
                <div className="mb-4 flex items-center gap-2">
                  <FiTag className="text-primary" />
                  <h2 className="text-lg font-semibold text-stone-950">
                    Categories
                  </h2>
                </div>
                {isEditing ? (
                  <CheckboxGroup
                    label="Assigned categories"
                    values={formData.category_ids}
                    onChange={(values) =>
                      setFormData({ ...formData, category_ids: values })
                    }
                    options={categoryData.map((category) => ({
                      label: category.name,
                      value: String(category.id),
                    }))}
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {categoryNames.length > 0 ? (
                      categoryNames.map((name) => (
                        <Badge key={name} color="warning">
                          {name}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-stone-500">
                        No categories assigned.
                      </span>
                    )}
                  </div>
                )}
              </section>

              <section className="surface p-5">
                <h2 className="text-lg font-semibold text-stone-950">
                  Description
                </h2>
                {isEditing ? (
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={updateField}
                    className="mt-3 min-h-36 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 shadow-sm transition placeholder:text-stone-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Description"
                  />
                ) : (
                  <p className="mt-3 leading-7 text-stone-600">
                    {book.description}
                  </p>
                )}
              </section>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showSaveConfirm}
        title="Save book changes?"
        message={`Update "${formData?.title || book?.title || "this book"}"?`}
        confirmText={isSaving ? "Saving..." : "Save"}
        onConfirm={handleSave}
        onCancel={() => setShowSaveConfirm(false)}
      />
    </>
  );
}
