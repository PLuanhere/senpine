"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface EditorialDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  ariaLabelledBy?: string;
  className?: string;
  closeAriaLabel?: string;
}

export function EditorialDialog({
  isOpen,
  onClose,
  children,
  ariaLabelledBy = "modal-title",
  className = "",
  closeAriaLabel = "Đóng cửa sổ",
}: EditorialDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        if (dialog.open) {
          dialog.close();
        }
        document.body.style.overflow = previousOverflow;
      };
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className={`modal editorial-modal ${className}`}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      aria-labelledby={ariaLabelledBy}
    >
      <button
        type="button"
        className="modal-close icon-button"
        onClick={onClose}
        aria-label={closeAriaLabel}
        autoFocus
      >
        <X size={21} />
      </button>
      {children}
    </dialog>
  );
}
