import clsx from "clsx";
import type { StatusOS, StatusAgendamento, TipoTransacao } from "../../types";
import { STATUS_OS_LABEL, STATUS_AGENDAMENTO_LABEL } from "../../lib/format";

const STATUS_OS_STYLE: Record<StatusOS, string> = {
  ABERTA: "bg-info-soft text-info",
  DIAGNOSTICO: "bg-warning-soft text-warning",
  AGUARDANDO_PECA: "bg-danger-soft text-danger",
  EM_EXECUCAO: "bg-accent-soft text-accent",
  PRONTA: "bg-success-soft text-success",
  ENTREGUE: "bg-surface-raised text-text-muted",
  CANCELADA: "bg-surface-raised text-text-faint line-through",
};

export function BadgeStatusOS({ status }: { status: StatusOS }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide",
        STATUS_OS_STYLE[status]
      )}
    >
      {STATUS_OS_LABEL[status]}
    </span>
  );
}

const STATUS_AG_STYLE: Record<StatusAgendamento, string> = {
  AGENDADO: "bg-info-soft text-info",
  CONFIRMADO: "bg-success-soft text-success",
  CANCELADO: "bg-danger-soft text-danger",
  CONCLUIDO: "bg-surface-raised text-text-muted",
};

export function BadgeStatusAgendamento({ status }: { status: StatusAgendamento }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold",
        STATUS_AG_STYLE[status]
      )}
    >
      {STATUS_AGENDAMENTO_LABEL[status]}
    </span>
  );
}

export function BadgeTipoTransacao({ tipo }: { tipo: TipoTransacao }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold",
        tipo === "RECEITA" ? "bg-success-soft text-success" : "bg-danger-soft text-danger"
      )}
    >
      {tipo === "RECEITA" ? "Receita" : "Despesa"}
    </span>
  );
}
