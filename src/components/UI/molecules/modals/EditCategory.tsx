import { useState } from "react";
import { FiSave, FiX } from "react-icons/fi";
import type { Category } from "../../../../types/category";
import { useUpdateCategoryMutation } from "../../../../services/bookmartApi";
import ConfirmModal from "./ConfirmModal";
import ModalShell from "./ModalShell";

type EditCategoryProps = {
  category: Category;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditCategory({
  category,
  onClose,
  onSuccess,
}: EditCategoryProps) {
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description || "");
  const [showConfirm, setShowConfirm] = useState(false);
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

  const requestUpdate = () => {
    if (!name.trim()) return alert("Category name cannot be empty");
    setShowConfirm(true);
  };

  const handleUpdate = async () => {
    try {
      await updateCategory({
        id: category.id,
        body: {
          name,
          description,
        },
      }).unwrap();
      setShowConfirm(false);
      onSuccess();
      onClose();
    } catch {
      alert("Failed to update category.");
    }
  };

  return (
    <>
      <ModalShell
        title="Edit Category"
        onClose={onClose}
        maxWidth="max-w-sm"
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
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Category Name"
          className="field w-full"
        />
        <input
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Category Description"
          className="field w-full"
        />
      </ModalShell>

      <ConfirmModal
        isOpen={showConfirm}
        title="Save category changes?"
        message={`Update "${category.name}"?`}
        confirmText="Save"
        onConfirm={handleUpdate}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
