

type ConfirmModalProps = {
  title?: string;
  message: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
};

export default function ConfirmModal({
  title = "Confirm Action",
  message,
  isOpen,
  onConfirm,
  onCancel,
  confirmText = "Yes",
  cancelText = "Cancel",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
        <h2 className="text-lg font-bold text-gray-800 mb-3">{title}</h2>
        <p className="text-gray-600 mb-5">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primarydark transition cursor-pointer"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition cursor-pointer"
            onClick={onCancel}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
