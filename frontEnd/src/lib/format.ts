export function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatarData(data: string | Date): string {
  const d = typeof data === "string" ? new Date(data) : data;
  return d.toLocaleDateString("pt-BR");
}

export function formatarDataHora(data: string | Date): string {
  const d = typeof data === "string" ? new Date(data) : data;
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatarTelefone(telefone: string): string {
  const digitos = telefone.replace(/\D/g, "");
  if (digitos.length === 11) {
    return digitos.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  if (digitos.length === 10) {
    return digitos.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return telefone;
}

export function formatarPlaca(placa: string): string {
  if (placa.length === 7) {
    return `${placa.slice(0, 3)}-${placa.slice(3)}`;
  }
  return placa;
}

export const STATUS_OS_LABEL: Record<string, string> = {
  ABERTA: "Aberta",
  DIAGNOSTICO: "Diagnóstico",
  AGUARDANDO_PECA: "Aguardando peça",
  EM_EXECUCAO: "Em execução",
  PRONTA: "Pronta",
  ENTREGUE: "Entregue",
  CANCELADA: "Cancelada",
};

export const STATUS_OS_ORDEM: string[] = [
  "ABERTA",
  "DIAGNOSTICO",
  "AGUARDANDO_PECA",
  "EM_EXECUCAO",
  "PRONTA",
  "ENTREGUE",
];

export const FORMA_PAGAMENTO_LABEL: Record<string, string> = {
  DINHEIRO: "Dinheiro",
  CARTAO_CREDITO: "Cartão de crédito",
  CARTAO_DEBITO: "Cartão de débito",
  PIX: "Pix",
  FIADO: "Fiado",
};

export const STATUS_AGENDAMENTO_LABEL: Record<string, string> = {
  AGENDADO: "Agendado",
  CONFIRMADO: "Confirmado",
  CANCELADO: "Cancelado",
  CONCLUIDO: "Concluído",
};
