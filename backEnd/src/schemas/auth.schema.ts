import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
});

export const criarUsuarioSchema = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  senha: z.string().min(6),
  cargo: z.enum(["ADMIN", "MECANICO", "ATENDENTE"]).default("ATENDENTE"),
});
