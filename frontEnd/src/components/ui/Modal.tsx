import { type ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  aberto: boolean;
  onFechar: () => void;
  titulo: string;
  children: ReactNode;
  largura?: "sm" | "md" | "lg";
}

export function Modal({ aberto, onFechar, titulo, children, largura = "md" }: ModalProps) {
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onFechar();
    }
    if (aberto) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [aberto, onFechar]);

  if (!aberto) return null;

  const larguraClass = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-3xl" }[largura];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/70 backdrop-blur-sm p-4 py-10">
      <div
        className={`w-full ${larguraClass} bg-surface border border-border rounded-lg shadow-2xl animate-[fadeIn_0.15s_ease-out]`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-soft">
          <h2 className="font-display text-xl font-semibold tracking-wide">{titulo}</h2>
          <button
            onClick={onFechar}
            className="text-text-muted hover:text-text transition-colors rounded p-1 hover:bg-surface-raised"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
