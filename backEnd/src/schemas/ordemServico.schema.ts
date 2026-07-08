import { z } from "zod";

export const statusOSEnum = z.enum([
  "ABERTA",
  "DIAGNOSTICO",
  "AGUARDANDO_PECA",
  "EM_EXECUCAO",
  "PRONTA",
  "ENTREGUE",
  "CANCELADA",
]);

export const formaPagamentoEnum = z.enum([
  "DINHEIRO",
  "CARTAO_CREDITO",
  "CARTAO_DEBITO",
  "PIX",
  "FIADO",
]);

export const ordemServicoSchema = z.object({
  clienteId: z.string().min(1),
  motoId: z.string().min(1),
  quilometragem: z.number().int().min(0),
  problema: z.string().min(5),
  diagnostico: z.string().optional(),
  status: statusOSEnum.default("ABERTA"),
  dataPrevisao: z.coerce.date().optional(),
  servicos: z
    .array(
      z.object({
        nome: z.string(),
        preco: z.number().min(0),
        descricao: z.string().optional(),
      })
    )
    .default([]),
  pecas: z
    .array(
      z.object({
        pecaId: z.string().optional(),
        nome: z.string(),
        quantidade: z.number().int().min(1),
        precoUnitario: z.number().min(0),
      })
    )
    .default([]),
  formaPagamento: formaPagamentoEnum.optional(),
  valorPago: z.number().min(0).default(0),
  troco: z.number().min(0).default(0),
  observacoes: z.string().optional(),
});

export const atualizarOrdemServicoSchema = ordemServicoSchema.partial();

export const atualizarStatusSchema = z.object({
  status: statusOSEnum,
});
