"use client";
import { useEffect, useRef, useId } from "react";
import { X } from "lucide-react";
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const titleId = useId();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className="modal"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <header>
        <div>
          <span className="eyebrow">ESPACIO DE TRABAJO</span>
          <h2 id={titleId}>{title}</h2>
        </div>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Cerrar diálogo"
        >
          <X />
        </button>
      </header>
      {children}
    </dialog>
  );
}
