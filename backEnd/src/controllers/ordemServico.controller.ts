import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ordemServicoSchema } from "../schemas/ordemServico.schema";
import { ZodError } from "zod";

const prisma = new PrismaClient();

export const criarOrdemServico = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const data = ordemServicoSchema.parse(req.body);

    const novaOS = await prisma.ordemServico.create({
      data: {
        clienteId: data.clienteId,
        motoId: data.motoId,
        quilometragem: data.quilometragem,
        problema: data.problema,
        diagnostico: data.diagnostico,
        status: data.status,
        servicos: data.servicos,
        pecas: data.pecas,
        total: data.total,
        formaPagamento: data.formaPagamento,
        valorPago: data.valorPago,
        troco: data.troco,
        observacoes: data.observacoes ?? null,
        dataEntrada: new Date(),
      },
    });

    return res.status(201).json(novaOS);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        mensagem: "Erro de validação",
        erros: error.errors,
      });
    }

    console.error(error);
    return res.status(500).json({
      mensagem: "Erro interno ao criar a ordem de serviço",
    });
  }
};

export const listarOrdensServico = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const ordens = await prisma.ordemServico.findMany({
      include: {
        cliente: true,
        moto: true,
      },
      orderBy: {
        dataEntrada: "desc",
      },
    });

    return res.status(200).json(ordens);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      mensagem: "Erro ao buscar as ordens de serviço",
    });
  }
};

export const getOrdemServicoPorId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    const ordem = await prisma.ordemServico.findUnique({
      where: { id },
      include: { cliente: true, moto: true },
    });

    if (!ordem) {
      return res
        .status(404)
        .json({ mensagem: "Ordem de serviço não encontrada" });
    }

    return res.status(200).json(ordem);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ mensagem: "Erro ao buscar ordem de serviço" });
  }
};

export const updateStatusOrdemServico = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const ordemAtualizada = await prisma.ordemServico.update({
      where: { id },
      data: { status },
    });

    return res.status(200).json(ordemAtualizada);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ mensagem: "Erro ao atualizar o status da OS" });
  }
};
