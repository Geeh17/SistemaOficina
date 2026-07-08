import { type ReactNode } from "react";
import clsx from "clsx";

interface StatCardProps {
  label: string;
  valor: string;
  icone: ReactNode;
  tom?: "neutro" | "accent" | "success" | "danger" | "warning";
  legenda?: string;
}

const TOM_STYLE = {
  neutro: "text-text bg-surface-raised",
  accent: "text-accent bg-accent-soft",
  success: "text-success bg-success-soft",
  danger: "text-danger bg-danger-soft",
  warning: "text-warning bg-warning-soft",
};

export function StatCard({ label, valor, icone, tom = "neutro", legenda }: StatCardProps) {
  return (
    <div className="bg-surface border border-border-soft rounded-lg p-4 flex items-start justify-between">
      <div>
        <p className="text-text-muted text-xs font-medium uppercase tracking-wide">{label}</p>
        <p className="font-display text-3xl font-bold mt-1 tracking-wide">{valor}</p>
        {legenda && <p className="text-text-faint text-xs mt-1">{legenda}</p>}
      </div>
      <div className={clsx("rounded-md p-2", TOM_STYLE[tom])}>{icone}</div>
    </div>
  );
}
