
import { FiCheck, FiX } from "react-icons/fi";
import ModalShell from "./ModalShell";

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
    <ModalShell
      title={title}
      onClose={onCancel}
      maxWidth="max-w-sm"
      footer={
        <>
          <button className="btn-primary" onClick={onConfirm}>
            <FiCheck size={16} />
            {confirmText}
          </button>
          <button className="btn-secondary" onClick={onCancel}>
            <FiX size={16} />
            {cancelText}
          </button>
        </>
      }
    >
      <p className="leading-relaxed text-stone-600">{message}</p>
    </ModalShell>
  );
}
