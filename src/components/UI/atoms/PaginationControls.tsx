import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  previousLabel?: string;
  nextLabel?: string;
  className?: string;
};

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  previousLabel = "Previous",
  nextLabel = "Next",
  className = "",
}: PaginationControlsProps) {
  const lastPage = Math.max(1, totalPages);

  return (
    <div className={`mt-6 flex items-center justify-between ${className}`}>
      <button
        className="btn-secondary h-10"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <FiChevronLeft size={16} />
        {previousLabel}
      </button>
      <span className="px-4 py-2 text-sm text-stone-600">
        Page {currentPage} of {lastPage}
      </span>
      <button
        className="btn-secondary h-10"
        onClick={() => onPageChange(Math.min(lastPage, currentPage + 1))}
        disabled={currentPage >= lastPage}
      >
        {nextLabel}
        <FiChevronRight size={16} />
      </button>
    </div>
  );
}
