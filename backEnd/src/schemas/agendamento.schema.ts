import { z } from "zod";

export const agendamentoSchema = z.object({
  clienteId: z.string().min(1),
  motoId: z.string().optional(),
  dataHora: z.coerce.date(),
  servico: z.string().min(2),
  status: z
    .enum(["AGENDADO", "CONFIRMADO", "CANCELADO", "CONCLUIDO"])
    .default("AGENDADO"),
  observacoes: z.string().optional(),
});

export const atualizarAgendamentoSchema = agendamentoSchema.partial();
