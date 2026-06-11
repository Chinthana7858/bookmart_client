import { useEffect, useState } from "react";
import { FiSave, FiUpload, FiX } from "react-icons/fi";
import type { Book } from "../../../../types/book";
import type { Category } from "../../../../types/category";
import {
  useGetCategoriesQuery,
  useUpdateProductMutation,
} from "../../../../services/bookmartApi";
import { CheckboxGroup } from "../../atoms/FormControls";
import ConfirmModal from "./ConfirmModal";
import ModalShell from "./ModalShell";

type EditBookProps = {
  book: Book;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditBook({ book, onClose, onSuccess }: EditBookProps) {
  const [formData, setFormData] = useState({
    title: book.title,
    description: book.description,
    publisher: book.publisher || "",
    author: book.author || "",
    language: book.language || "",
    price: String(book.price),
    stock: String(book.stock),
    category_ids: (book.category_ids?.length ? book.category_ids : [book.category_id]).map(String),
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(book.imageUrl);
  const [showConfirm, setShowConfirm] = useState(false);
  const { data: categoryData = [], isError: categoriesFailed } = useGetCategoriesQuery();
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  useEffect(() => {
    setCategories(categoryData);
  }, [categoryData]);

  useEffect(() => {
    if (categoriesFailed) alert("Failed to load categories");
  }, [categoriesFailed]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const validateForm = () => {
    const { title, description, price, stock, category_ids } = formData;

    if (!title || !description || !price || !stock || category_ids.length === 0) {
      alert("Title, description, price, stock, and category are required.");
      return false;
    }

    return true;
  };

  const requestUpdate = () => {
    if (validateForm()) setShowConfirm(true);
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    const bookForm = new FormData();
    bookForm.append("title", formData.title);
    bookForm.append("description", formData.description);
    bookForm.append("publisher", formData.publisher);
    bookForm.append("author", formData.author);
    bookForm.append("language", formData.language);
    bookForm.append("price", formData.price);
    bookForm.append("stock", formData.stock);
    bookForm.append("category_ids", JSON.stringify(formData.category_ids.map(Number)));
    if (file) bookForm.append("file", file);

    try {
      await updateProduct({ id: book.id, body: bookForm }).unwrap();
      setShowConfirm(false);
      onSuccess();
      onClose();
    } catch {
      alert("Failed to update book.");
    }
  };

  return (
    <>
      <ModalShell
        title="Edit Book"
        onClose={onClose}
        maxWidth="max-w-lg"
        footer={
          <>
            <button
              onClick={onClose}
              className="btn-secondary"
              disabled={isLoading}
            >
              <FiX size={16} />
              Cancel
            </button>
            <button
              onClick={requestUpdate}
              className="btn-primary"
              disabled={isLoading}
            >
              <FiSave size={16} />
              {isLoading ? "Saving..." : "Save"}
            </button>
          </>
        }
      >
        <input
          type="text"
          name="title"
          placeholder="Book Title"
          value={formData.title}
          onChange={handleChange}
          className="field w-full"
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={formData.author}
            onChange={handleChange}
            className="field w-full"
          />
          <input
            type="text"
            name="publisher"
            placeholder="Publisher"
            value={formData.publisher}
            onChange={handleChange}
            className="field w-full"
          />
          <input
            type="text"
            name="language"
            placeholder="Language"
            value={formData.language}
            onChange={handleChange}
            className="field w-full"
          />
        </div>

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="min-h-24 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 shadow-sm transition placeholder:text-stone-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="field w-full"
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            className="field w-full"
          />
        </div>

        <CheckboxGroup
          label="Categories"
          values={formData.category_ids}
          onChange={(values) => setFormData({ ...formData, category_ids: values })}
          options={[
            ...categories.map((cat) => ({
              label: cat.name,
              value: String(cat.id),
            })),
          ]}
        />

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="h-48 w-full rounded-md border border-stone-200 bg-stone-50 object-contain"
          />
        )}

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primarydark">
          <FiUpload size={16} />
          Replace Image
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </ModalShell>

      <ConfirmModal
        isOpen={showConfirm}
        title="Save book changes?"
        message={`Update "${book.title}"?`}
        confirmText="Save"
        onConfirm={handleUpdate}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
