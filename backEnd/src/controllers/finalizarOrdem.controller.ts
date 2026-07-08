import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const finalizarOrdemServico = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const ordem = await prisma.ordemServico.findUnique({ where: { id } });
    if (!ordem) {
      res.status(404).json({ mensagem: "Ordem de serviço não encontrada" });
      return;
    }

    const ordemFinalizada = await prisma.ordemServico.update({
      where: { id },
      data: {
        status: "Finalizada",
        dataSaida: new Date(),
      },
    });

    res.status(200).json(ordemFinalizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao finalizar a ordem de serviço" });
  }
};
