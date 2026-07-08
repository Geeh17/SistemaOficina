import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { agendamentoSchema, atualizarAgendamentoSchema } from "../schemas/agendamento.schema";
import { ApiError } from "../utils/ApiError";

export const criarAgendamento = async (req: Request, res: Response): Promise<void> => {
  const data = agendamentoSchema.parse(req.body);
  const agendamento = await prisma.agendamento.create({
    data,
    include: { cliente: true, moto: true },
  });
  res.status(201).json(agendamento);
};

export const listarAgendamentos = async (req: Request, res: Response): Promise<void> => {
  const { de, ate, status } = req.query;

  const agendamentos = await prisma.agendamento.findMany({
    where: {
      status: status ? (String(status) as any) : undefined,
      dataHora:
        de || ate
          ? {
              gte: de ? new Date(String(de)) : undefined,
              lte: ate ? new Date(String(ate)) : undefined,
            }
          : undefined,
    },
    include: { cliente: true, moto: true },
    orderBy: { dataHora: "asc" },
  });

  res.status(200).json(agendamentos);
};

export const atualizarAgendamento = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const data = atualizarAgendamentoSchema.parse(req.body);
  const agendamento = await prisma.agendamento.update({
    where: { id },
    data,
    include: { cliente: true, moto: true },
  });
  res.status(200).json(agendamento);
};

export const removerAgendamento = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await prisma.agendamento.delete({ where: { id } });
  res.status(204).send();
};
