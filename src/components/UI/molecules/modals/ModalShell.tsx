import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

type ModalShellProps = {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose?: () => void;
  maxWidth?: string;
};

export default function ModalShell({
  title,
  children,
  footer,
  onClose,
  maxWidth = "max-w-2xl",
}: ModalShellProps) {
  const modal = (
    <div className="fixed inset-0 z-[100] flex min-h-dvh w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-stone-950/35 p-4 backdrop-blur-sm">
      <div className={`relative z-[101] w-full ${maxWidth}`}>
        <div className="relative max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-lg border border-stone-200 bg-white p-4 shadow-sm md:p-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4 md:pb-5">
            <h3 className="text-lg font-medium text-stone-950">{title}</h3>
            {onClose && (
              <button
                type="button"
                className="ms-auto inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent text-stone-500 transition hover:bg-stone-100 hover:text-stone-950"
                onClick={onClose}
                aria-label="Close modal"
              >
                <FiX className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="space-y-4 py-4 md:space-y-6 md:py-6">{children}</div>

          {footer && (
            <div className="flex items-center justify-end gap-3 border-t border-stone-200 pt-4 md:pt-5">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") {
    return modal;
  }

  return createPortal(modal, document.body);
}
