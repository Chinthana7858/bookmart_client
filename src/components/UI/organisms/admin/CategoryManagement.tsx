import { useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import AddCategory from "../../molecules/modals/AddCategory";
import EditCategory from "../../molecules/modals/EditCategory";
import LoadingSpinner from "../../atoms/LoadingSpinner";
import PaginationControls from "../../atoms/PaginationControls";
import ConfirmModal from "../../molecules/modals/ConfirmModal";
import { ADMIN_PAGE_SIZE } from "../../../../features/admin/adminConstants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import {
  useDeleteCategoryMutation,
  useGetCategoriesPaginatedQuery,
} from "../../../../services/bookmartApi";
import type { Category } from "../../../../types/category";

export default function CategoryManagement() {
  const [showModal, setShowModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading: loading, refetch } = useGetCategoriesPaginatedQuery({
    skip: (currentPage - 1) * ADMIN_PAGE_SIZE,
    limit: ADMIN_PAGE_SIZE,
  });
  const [deleteCategory] = useDeleteCategoryMutation();
  const categories = data?.categories ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE));

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete).unwrap();
      setCategoryToDelete(null);
      if (categories.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
      } else {
        refetch();
      }
    } catch {
      alert("Delete failed");
    }
  };

  const handleCategoryAdded = () => {
    if (currentPage === 1) {
      refetch();
    } else {
      setCurrentPage(1);
    }
  };



  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-stone-950">Category Management</h2>
        <button
          className="btn-primary"
          onClick={() => setShowModal(true)}
        >
          <FiPlus size={17} />
          Add Category
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : categories.length === 0 ? (
        <div className="surface py-12 text-center text-stone-500">No categories found.</div>
      ) : (
        <>
        <div className="bookmart-table overflow-x-auto sm:rounded-lg">
          <Table hoverable>
            <TableHead>
              <TableRow>
                <TableHeadCell>ID</TableHeadCell>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>Description</TableHeadCell>
                <TableHeadCell>Actions</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {categories.map((cat) => (
                <TableRow key={cat.id} className="bg-white">
                  <TableCell>{cat.id}</TableCell>
                  <TableCell className="font-medium text-gray-900">{cat.name}</TableCell>
                  <TableCell className="max-w-xl">{cat.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-3">
                      <button
                        className="inline-flex cursor-pointer items-center gap-1.5 font-medium text-primary hover:text-primarydark hover:underline"
                        onClick={() => setCategoryToEdit(cat)}
                      >
                        <FiEdit2 size={15} />
                        Edit
                      </button>
                      <button
                        className="inline-flex cursor-pointer items-center gap-1.5 font-medium text-primary hover:text-primarydark hover:underline"
                        onClick={() => setCategoryToDelete(cat.id)}
                      >
                        <FiTrash2 size={15} />
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        </>
      )}

      {showModal && (
        <AddCategory
          onClose={() => setShowModal(false)}
          onSuccess={handleCategoryAdded}
      
        />
      )}

      {categoryToEdit && (
        <EditCategory
          category={categoryToEdit}
          onClose={() => setCategoryToEdit(null)}
          onSuccess={refetch}
        />
      )}

      <ConfirmModal
        isOpen={categoryToDelete !== null}
        title="Delete category?"
        message="This category will be removed."
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setCategoryToDelete(null)}
      />
    </div>
  );
}
