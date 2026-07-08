import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const resumoDashboard = async (_req: Request, res: Response): Promise<void> => {
  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);

  const [
    ordensAbertas,
    ordensPorStatus,
    pecasEstoqueBaixo,
    transacoesMes,
    proximosAgendamentos,
  ] = await Promise.all([
    prisma.ordemServico.count({
      where: { status: { notIn: ["ENTREGUE", "CANCELADA"] } },
    }),
    prisma.ordemServico.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.peca.findMany(),
    prisma.transacao.findMany({ where: { data: { gte: inicioMes } } }),
    prisma.agendamento.findMany({
      where: { dataHora: { gte: new Date() }, status: { not: "CANCELADO" } },
      include: { cliente: true, moto: true },
      orderBy: { dataHora: "asc" },
      take: 5,
    }),
  ]);

  const receitasMes = transacoesMes
    .filter((t: { tipo: string; valor: number }) => t.tipo === "RECEITA")
    .reduce((a: number, t: { valor: number }) => a + t.valor, 0);
  const despesasMes = transacoesMes
    .filter((t: { tipo: string; valor: number }) => t.tipo === "DESPESA")
    .reduce((a: number, t: { valor: number }) => a + t.valor, 0);

  res.status(200).json({
    ordensAbertas,
    ordensPorStatus,
    pecasEstoqueBaixo: pecasEstoqueBaixo.filter(
      (p: { quantidade: number; quantidadeMinima: number }) => p.quantidade <= p.quantidadeMinima
    ).length,
    faturamentoMes: receitasMes,
    despesasMes,
    saldoMes: receitasMes - despesasMes,
    proximosAgendamentos,
  });
};
