import  { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { useAddCategoryMutation } from "../../../../services/bookmartApi";
import ConfirmModal from "./ConfirmModal";
import ModalShell from "./ModalShell";

interface AddCategoryProps {
  onClose: () => void;
  onSuccess: () => void; 
}

export default function AddCategory({ onClose, onSuccess }: AddCategoryProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
   const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [addCategory, { isLoading: loading }] = useAddCategoryMutation();

  const requestAdd = () => {
    if (!newCategoryName.trim()) return alert("Category name cannot be empty");
    setShowConfirm(true);
  };

  const handleAdd = async () => {
    try {
      await addCategory({
        name: newCategoryName,
        description: newCategoryDescription,
      }).unwrap();
      setShowConfirm(false);
      onClose();
      onSuccess(); 
    } catch {
      alert("Failed to add category");
    }
  };

  return (
    <>
      <ModalShell
        title="Add New Category"
        onClose={onClose}
        maxWidth="max-w-sm"
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
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Category Name"
          className="field w-full"
        />
        <input
          type="text"
          value={newCategoryDescription}
          onChange={(e) => setNewCategoryDescription(e.target.value)}
          placeholder="Category Description"
          className="field w-full"
        />
      </ModalShell>

      <ConfirmModal
        isOpen={showConfirm}
        title="Add category?"
        message={`Create "${newCategoryName}" as a new category?`}
        confirmText="Add"
        onConfirm={handleAdd}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
