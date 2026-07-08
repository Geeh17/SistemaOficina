import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { transacaoSchema } from "../schemas/transacao.schema";
import { ApiError } from "../utils/ApiError";

export const criarTransacao = async (req: Request, res: Response): Promise<void> => {
  const data = transacaoSchema.parse(req.body);
  const transacao = await prisma.transacao.create({ data });
  res.status(201).json(transacao);
};

export const listarTransacoes = async (req: Request, res: Response): Promise<void> => {
  const { tipo, de, ate } = req.query;

  const transacoes = await prisma.transacao.findMany({
    where: {
      tipo: tipo ? (String(tipo) as any) : undefined,
      data:
        de || ate
          ? {
              gte: de ? new Date(String(de)) : undefined,
              lte: ate ? new Date(String(ate)) : undefined,
            }
          : undefined,
    },
    orderBy: { data: "desc" },
  });

  res.status(200).json(transacoes);
};

export const resumoFinanceiro = async (req: Request, res: Response): Promise<void> => {
  const { de, ate } = req.query;

  const filtroData =
    de || ate
      ? {
          gte: de ? new Date(String(de)) : undefined,
          lte: ate ? new Date(String(ate)) : undefined,
        }
      : undefined;

  const transacoes = await prisma.transacao.findMany({
    where: { data: filtroData },
  });

  const receitas = transacoes.filter((t: { tipo: string }) => t.tipo === "RECEITA").reduce((a: number, t: { valor: number }) => a + t.valor, 0);
  const despesas = transacoes.filter((t: { tipo: string }) => t.tipo === "DESPESA").reduce((a: number, t: { valor: number }) => a + t.valor, 0);

  res.status(200).json({
    receitas,
    despesas,
    saldo: receitas - despesas,
    totalTransacoes: transacoes.length,
  });
};

export const removerTransacao = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await prisma.transacao.delete({ where: { id } });
  res.status(204).send();
};
