import  { useState } from "react";
import axios from "axios";
import API from "../../../../const/api_paths";

interface AddCategoryProps {
  onClose: () => void;
  onSuccess: () => void; 
}

export default function AddCategory({ onClose, onSuccess }: AddCategoryProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
   const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    if (!newCategoryName.trim()) return alert("Category name cannot be empty");

    setLoading(true);
    axios
      .post(
        API.ADD_CATEGORY,
        { name: newCategoryName, description:newCategoryDescription },
        { withCredentials: true }
      )
      .then(() => {
        onClose();
        onSuccess(); 
      })
      .catch(() => alert("Failed to add category"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="fixed inset-0 bg-gray-800/50 backdrop-blur-xs flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Category Name"
          className="w-full px-3 py-2 border rounded mb-4"
        />
        <input
          type="text"
          value={newCategoryDescription}
          onChange={(e) => setNewCategoryDescription(e.target.value)}
          placeholder="Category Description"
          className="w-full px-3 py-2 border rounded mb-4"
        />
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
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
