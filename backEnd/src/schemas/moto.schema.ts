import { z } from "zod";

export const motoSchema = z.object({
  clienteId: z.string().min(1, "Cliente é obrigatório"),
  marca: z.string().min(1),
  modelo: z.string().min(1),
  placa: z
    .string()
    .min(7)
    .max(8)
    .transform((v) => v.toUpperCase().replace("-", "")),
  ano: z.number().int().min(1950).max(new Date().getFullYear() + 1),
  cor: z.string().min(1),
  cilindrada: z.number().int().min(50),
});

export const atualizarMotoSchema = motoSchema.partial();
