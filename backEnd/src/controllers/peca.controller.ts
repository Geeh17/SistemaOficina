import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { pecaSchema, atualizarPecaSchema, movimentacaoSchema } from "../schemas/peca.schema";
import { ApiError } from "../utils/ApiError";

export const criarPeca = async (req: Request, res: Response): Promise<void> => {
  const data = pecaSchema.parse(req.body);
  const peca = await prisma.peca.create({ data });
  res.status(201).json(peca);
};

export const listarPecas = async (req: Request, res: Response): Promise<void> => {
  const { busca, estoqueBaixo } = req.query;

  const pecas = await prisma.peca.findMany({
    where: busca
      ? {
          OR: [
            { nome: { contains: String(busca), mode: "insensitive" } },
            { codigo: { contains: String(busca), mode: "insensitive" } },
            { categoria: { contains: String(busca), mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { nome: "asc" },
  });

  const resultado =
    estoqueBaixo === "true"
      ? pecas.filter((p: { quantidade: number; quantidadeMinima: number }) => p.quantidade <= p.quantidadeMinima)
      : pecas;

  res.status(200).json(resultado);
};

export const getPecaPorId = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const peca = await prisma.peca.findUnique({
    where: { id },
    include: { movimentacoes: { orderBy: { createdAt: "desc" }, take: 20 } },
  });
  if (!peca) throw new ApiError(404, "Peça não encontrada");
  res.status(200).json(peca);
};

export const atualizarPeca = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const data = atualizarPecaSchema.parse(req.body);
  const peca = await prisma.peca.update({ where: { id }, data });
  res.status(200).json(peca);
};

export const removerPeca = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await prisma.peca.delete({ where: { id } });
  res.status(204).send();
};

export const movimentarEstoque = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const data = movimentacaoSchema.parse(req.body);

  const peca = await prisma.peca.findUnique({ where: { id } });
  if (!peca) throw new ApiError(404, "Peça não encontrada");

  if (data.tipo === "SAIDA" && peca.quantidade < data.quantidade) {
    throw new ApiError(400, "Quantidade em estoque insuficiente");
  }

  const novaQuantidade =
    data.tipo === "ENTRADA"
      ? peca.quantidade + data.quantidade
      : peca.quantidade - data.quantidade;

  const [pecaAtualizada] = await prisma.$transaction([
    prisma.peca.update({ where: { id }, data: { quantidade: novaQuantidade } }),
    prisma.movimentacaoEstoque.create({
      data: {
        pecaId: id,
        tipo: data.tipo,
        quantidade: data.quantidade,
        motivo: data.motivo,
        ordemServicoId: data.ordemServicoId,
      },
    }),
  ]);

  res.status(200).json(pecaAtualizada);
};
