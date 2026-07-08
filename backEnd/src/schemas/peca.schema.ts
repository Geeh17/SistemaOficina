import { z } from "zod";

export const pecaSchema = z.object({
  nome: z.string().min(2),
  codigo: z.string().min(1),
  categoria: z.string().min(1),
  quantidade: z.number().int().min(0).default(0),
  quantidadeMinima: z.number().int().min(0).default(2),
  precoCusto: z.number().min(0),
  precoVenda: z.number().min(0),
  fornecedor: z.string().optional(),
});

export const atualizarPecaSchema = pecaSchema.partial();

export const movimentacaoSchema = z.object({
  tipo: z.enum(["ENTRADA", "SAIDA"]),
  quantidade: z.number().int().min(1),
  motivo: z.string().min(2),
  ordemServicoId: z.string().optional(),
});
