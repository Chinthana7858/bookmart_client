

type AlertModalProps = {
  isOpen: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  type?:  "success" | "error";
};

const typeColors = {
  success: "bg-green-100 text-green-800",
  error: "bg-red-100 text-red-800",
};

export default function AlertModal({
  isOpen,
  title = "Notice",
  message,
  onClose,
  type = "success",
}: AlertModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
        <div className={`mb-4 py-2 px-3 rounded ${typeColors[type]}`}>
          <h2 className="text-lg font-bold">{title}</h2>
        </div>
        <p className="text-gray-700 mb-6">{message}</p>
        <button
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primarydark transition cursor-pointer"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
}
