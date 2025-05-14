import { useEffect, useState } from "react";
import axios from "axios";
import API from "../../../../const/api_paths";
import AddCategory from "../../molecules/modals/AddCategory";
import type { Category } from "../../../../types/category";
import LoadingSpinner from "../../atoms/LoadingSpinner";


export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchCategories = () => {
    axios
      .get(API.GET_CATEGORIES, { withCredentials: true })
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Failed to fetch categories:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    axios
      .delete(`${API.DELETE_CATEGORY}/${id}`, { withCredentials: true })
      .then(() => {
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
      })
      .catch(() => alert("Delete failed"));
  };



  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Category Management</h2>
        <button
          className="bg-primary text-white px-4 py-2 rounded hover:bg-orange-700"
          onClick={() => setShowModal(true)}
        >
          + Add Category
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-orange-100 text-left">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-orange-50">
                <td className="border px-4 py-2">{cat.id}</td>
                <td className="border px-4 py-2">{cat.name}</td>
                <td className="border px-4 py-2">{cat.description}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(cat.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <AddCategory
          onClose={() => setShowModal(false)}
           onSuccess={fetchCategories}
      
        />
      )}
    </div>
  );
}
