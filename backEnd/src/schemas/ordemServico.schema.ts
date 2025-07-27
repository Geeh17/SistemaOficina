import { z } from "zod";

export const ordemServicoSchema = z.object({
  clienteId: z.string(),
  motoId: z.string(),
  quilometragem: z.number().int().min(0),
  problema: z.string().min(5),
  diagnostico: z.string().min(5),
  status: z.enum(["Aguardando", "Em execução", "Finalizada", "Entregue"]),
  servicos: z.array(
    z.object({
      nome: z.string(),
      preco: z.number().min(0),
      descricao: z.string().optional(),
    })
  ),
  pecas: z.array(
    z.object({
      nome: z.string(),
      quantidade: z.number().int().min(1),
      precoUnitario: z.number().min(0),
    })
  ),
  total: z.number().min(0),
  formaPagamento: z.enum(["Dinheiro", "Cartão", "Pix", "Fiado"]),
  valorPago: z.number().min(0),
  troco: z.number().min(0),
  observacoes: z.string().optional(),
});
