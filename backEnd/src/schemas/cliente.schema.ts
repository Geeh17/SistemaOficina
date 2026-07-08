import { z } from "zod";

const enderecoSchema = z.object({
  rua: z.string().min(1),
  numero: z.string().min(1),
  bairro: z.string().min(1),
  cidade: z.string().min(1),
  estado: z.string().length(2),
  cep: z.string().min(8),
  complemento: z.string().optional(),
});

export const clienteSchema = z.object({
  nome: z.string().min(2, "Nome muito curto"),
  cpfCnpj: z.string().min(11, "CPF/CNPJ inválido"),
  telefone: z.string().min(8),
  email: z.string().email().optional().or(z.literal("")),
  endereco: enderecoSchema,
});

export const atualizarClienteSchema = clienteSchema.partial();
