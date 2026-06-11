import { useState, useEffect } from "react";
import { FiPlus, FiUpload, FiX } from "react-icons/fi";
import type { Category } from "../../../../types/category";
import { CheckboxGroup } from "../../atoms/FormControls";
import {
  useAddProductMutation,
  useGetCategoriesQuery,
} from "../../../../services/bookmartApi";
import ConfirmModal from "./ConfirmModal";
import ModalShell from "./ModalShell";

interface AddBookProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddBook({ onClose, onSuccess }: AddBookProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    publisher: "",
    author: "",
    language: "",
    price: "",
    stock: "",
    category_ids: [] as string[],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const { data: categoryData = [], isError: categoriesFailed } = useGetCategoriesQuery();
  const [addProduct, { isLoading: loading }] = useAddProductMutation();

  // Fetch categories on mount
  useEffect(() => {
    setCategories(categoryData);
  }, [categoryData]);

  useEffect(() => {
    if (categoriesFailed) alert("Failed to load categories");
  }, [categoriesFailed]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const validateForm = () => {
    const { title, description, price, stock, category_ids } = formData;

    if (!title || !description || !price || !stock || category_ids.length === 0 || !file) {
      alert("All fields including image are required.");
      return false;
    }

    return true;
  };

  const requestAdd = () => {
    if (validateForm()) setShowConfirm(true);
  };

  const handleAdd = async () => {
    const { title, description, publisher, author, language, price, stock, category_ids } = formData;
    if (!validateForm()) return;
    if (!file) return;

    const bookForm = new FormData();
    bookForm.append("title", title);
    bookForm.append("description", description);
    bookForm.append("publisher", publisher);
    bookForm.append("author", author);
    bookForm.append("language", language);
    bookForm.append("price", price);
    bookForm.append("stock", stock);
    bookForm.append("category_ids", JSON.stringify(category_ids.map(Number)));
    bookForm.append("file", file);

    try {
      await addProduct(bookForm).unwrap();
      setShowConfirm(false);
      onClose();
      onSuccess();
    } catch {
      alert("Failed to add book.");
    }
  };

  return (
    <>
      <ModalShell
        title="Add New Book"
        onClose={onClose}
        maxWidth="max-w-lg"
        footer={
          <>
            <button
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              <FiX size={16} />
              Cancel
            </button>
            <button
              onClick={requestAdd}
              className="btn-primary"
              disabled={loading}
            >
              <FiPlus size={16} />
              {loading ? "Adding..." : "Add"}
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
          Upload Image
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
        title="Add book?"
        message={`Create "${formData.title}" in the catalogue?`}
        confirmText="Add"
        onConfirm={handleAdd}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
