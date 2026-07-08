import { type ReactNode } from "react";

interface EmptyStateProps {
  icone: ReactNode;
  titulo: string;
  descricao?: string;
  acao?: ReactNode;
}

export function EmptyState({ icone, titulo, descricao, acao }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="text-text-faint mb-3">{icone}</div>
      <p className="font-display text-lg font-semibold text-text">{titulo}</p>
      {descricao && <p className="text-text-muted text-sm mt-1 max-w-sm">{descricao}</p>}
      {acao && <div className="mt-4">{acao}</div>}
    </div>
  );
}
