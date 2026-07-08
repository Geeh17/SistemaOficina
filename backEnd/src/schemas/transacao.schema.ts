import { z } from "zod";

export const transacaoSchema = z.object({
  tipo: z.enum(["RECEITA", "DESPESA"]),
  categoria: z.string().min(1),
  descricao: z.string().min(2),
  valor: z.number().min(0.01),
  formaPagamento: z
    .enum(["DINHEIRO", "CARTAO_CREDITO", "CARTAO_DEBITO", "PIX", "FIADO"])
    .optional(),
  ordemServicoId: z.string().optional(),
  data: z.coerce.date().optional(),
});
