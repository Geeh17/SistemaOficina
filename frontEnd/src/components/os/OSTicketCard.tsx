import { Bike, User } from "lucide-react";
import clsx from "clsx";
import type { OrdemServico, StatusOS } from "../../types";
import { formatarMoeda, formatarData, formatarPlaca } from "../../lib/format";

const STATUS_ACCENT: Record<StatusOS, string> = {
  ABERTA: "bg-info",
  DIAGNOSTICO: "bg-warning",
  AGUARDANDO_PECA: "bg-danger",
  EM_EXECUCAO: "bg-accent",
  PRONTA: "bg-success",
  ENTREGUE: "bg-text-faint",
  CANCELADA: "bg-text-faint",
};

interface Props {
  os: OrdemServico;
  onClick: () => void;
  arrastavel?: boolean;
}

// Cartão no formato de etiqueta de ordem de serviço — canhoto perfurado à
// esquerda com o número da OS, como as etiquetas físicas presas na moto.
export function OSTicketCard({ os, onClick, arrastavel }: Props) {
  return (
    <button
      onClick={onClick}
      draggable={arrastavel}
      data-os-id={os.id}
      className="group w-full text-left bg-surface-raised border border-border rounded-md overflow-hidden flex hover:border-accent/50 hover:-translate-y-0.5 transition-all shadow-sm"
    >
      {/* canhoto */}
      <div className={clsx("relative w-9 shrink-0 flex items-center justify-center", STATUS_ACCENT[os.status], "bg-opacity-90")}>
        <span
          className="font-mono text-[11px] font-bold text-ink tracking-widest"
          style={{ writingMode: "vertical-rl" }}
        >
          OS-{String(os.numero).padStart(4, "0")}
        </span>
        {/* linha perfurada */}
        <div className="absolute right-0 top-0 bottom-0 border-r border-dashed border-ink/25" />
        <span className="absolute -right-[3px] top-1.5 w-[6px] h-[6px] rounded-full bg-ink" />
        <span className="absolute -right-[3px] bottom-1.5 w-[6px] h-[6px] rounded-full bg-ink" />
      </div>

      {/* corpo */}
      <div className="flex-1 min-w-0 p-3">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-text truncate">
          <User size={12} className="text-text-faint shrink-0" />
          <span className="truncate">{os.cliente?.nome}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-text-muted mt-0.5 truncate">
          <Bike size={12} className="text-text-faint shrink-0" />
          <span className="truncate">
            {os.moto?.marca} {os.moto?.modelo} · {formatarPlaca(os.moto?.placa ?? "")}
          </span>
        </div>
        <p className="text-xs text-text-faint mt-2 line-clamp-2">{os.problema}</p>
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-border-soft">
          <span className="text-[11px] text-text-faint">{formatarData(os.dataEntrada)}</span>
          <span className="font-mono text-sm font-semibold text-accent">
            {formatarMoeda(os.total)}
          </span>
        </div>
      </div>
    </button>
  );
}
