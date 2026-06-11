import ModalShell from "./ModalShell";

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
    <ModalShell
      title={title}
      onClose={onClose}
      maxWidth="max-w-sm"
      footer={
        <button className="btn-primary" onClick={onClose}>
          OK
        </button>
      }
    >
      <div className={`rounded-md px-3 py-2 text-sm font-medium ${typeColors[type]}`}>
        {type === "success" ? "Success" : "Error"}
      </div>
      <p className="leading-relaxed text-stone-600">{message}</p>
    </ModalShell>
  );
}
