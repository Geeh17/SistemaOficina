import { Loader2 } from "lucide-react";

export function Loader({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-text-muted text-sm">
      <Loader2 size={18} className="animate-spin" />
      {label}
    </div>
  );
}
