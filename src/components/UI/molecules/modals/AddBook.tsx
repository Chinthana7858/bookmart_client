import { useState, useEffect } from "react";
import axios from "axios";
import API from "../../../../const/api_paths";
import type { Category } from "../../../../types/category";

interface AddBookProps {
  onClose: () => void;
  onSuccess: () => void;
}


export default function AddBook({ onClose, onSuccess }: AddBookProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    axios
      .get(API.GET_CATEGORIES, { withCredentials: true })
      .then((res) => setCategories(res.data))
      .catch(() => alert("Failed to load categories"));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAdd = async () => {
    const { title, description, price, stock, category_id } = formData;

    if (!title || !description || !price || !stock || !category_id || !file) {
      return alert("All fields including image are required.");
    }

    const bookForm = new FormData();
    bookForm.append("title", title);
    bookForm.append("description", description);
    bookForm.append("price", price);
    bookForm.append("stock", stock);
    bookForm.append("category_id", category_id);
    bookForm.append("file", file);

    setLoading(true);
    try {
      await axios.post(API.ADD_PRODUCT, bookForm, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      onClose();
      onSuccess();
    } catch (err) {
      alert("Failed to add book.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Add New Book</h3>

        <input
          type="text"
          name="title"
          placeholder="Book Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded mb-3"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded mb-3"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded mb-3"
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded mb-3"
        />

        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded mb-3"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label className="inline-block bg-primary text-white text-sm px-4 py-2 rounded cursor-pointer hover:bg-primarydark mb-4">
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primarydark"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
