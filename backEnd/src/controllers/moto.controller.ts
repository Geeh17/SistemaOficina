import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { motoSchema, atualizarMotoSchema } from "../schemas/moto.schema";
import { ApiError } from "../utils/ApiError";

export const criarMoto = async (req: Request, res: Response): Promise<void> => {
  const data = motoSchema.parse(req.body);
  const moto = await prisma.moto.create({ data });
  res.status(201).json(moto);
};

export const listarMotos = async (req: Request, res: Response): Promise<void> => {
  const { clienteId, busca } = req.query;

  const motos = await prisma.moto.findMany({
    where: {
      clienteId: clienteId ? String(clienteId) : undefined,
      ...(busca
        ? {
            OR: [
              { placa: { contains: String(busca), mode: "insensitive" } },
              { modelo: { contains: String(busca), mode: "insensitive" } },
              { marca: { contains: String(busca), mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { cliente: true },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json(motos);
};

export const getMotoPorId = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const moto = await prisma.moto.findUnique({
    where: { id },
    include: { cliente: true, ordens: { orderBy: { createdAt: "desc" } } },
  });

  if (!moto) throw new ApiError(404, "Moto não encontrada");
  res.status(200).json(moto);
};

export const atualizarMoto = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const data = atualizarMotoSchema.parse(req.body);
  const moto = await prisma.moto.update({ where: { id }, data });
  res.status(200).json(moto);
};

export const removerMoto = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await prisma.moto.delete({ where: { id } });
  res.status(204).send();
};
