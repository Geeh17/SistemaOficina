import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { clienteSchema, atualizarClienteSchema } from "../schemas/cliente.schema";
import { ApiError } from "../utils/ApiError";

export const criarCliente = async (req: Request, res: Response): Promise<void> => {
  const data = clienteSchema.parse(req.body);
  const cliente = await prisma.cliente.create({ data });
  res.status(201).json(cliente);
};

export const listarClientes = async (req: Request, res: Response): Promise<void> => {
  const { busca } = req.query;

  const clientes = await prisma.cliente.findMany({
    where: busca
      ? {
          OR: [
            { nome: { contains: String(busca), mode: "insensitive" } },
            { cpfCnpj: { contains: String(busca) } },
            { telefone: { contains: String(busca) } },
          ],
        }
      : undefined,
    include: { motos: true },
    orderBy: { nome: "asc" },
  });

  res.status(200).json(clientes);
};

export const getClientePorId = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const cliente = await prisma.cliente.findUnique({
    where: { id },
    include: { motos: true, ordens: { orderBy: { createdAt: "desc" } } },
  });

  if (!cliente) throw new ApiError(404, "Cliente não encontrado");
  res.status(200).json(cliente);
};

export const atualizarCliente = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const data = atualizarClienteSchema.parse(req.body);
  const cliente = await prisma.cliente.update({ where: { id }, data });
  res.status(200).json(cliente);
};

export const removerCliente = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await prisma.cliente.delete({ where: { id } });
  res.status(204).send();
};
