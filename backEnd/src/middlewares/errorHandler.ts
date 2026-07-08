import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";
import { Prisma } from "@prisma/client";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      mensagem: "Erro de validação",
      erros: err.issues.map((i) => ({
        campo: i.path.join("."),
        mensagem: i.message,
      })),
    });
    return;
  }

  if (err instanceof ApiError) {
    res.status(err.status).json({
      mensagem: err.message,
      detalhes: err.detalhes,
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      res.status(409).json({
        mensagem: "Já existe um registro com esse valor único (duplicado).",
        campo: err.meta?.target,
      });
      return;
    }
    if (err.code === "P2025") {
      res.status(404).json({ mensagem: "Registro não encontrado." });
      return;
    }
  }

  console.error(err);
  res.status(500).json({ mensagem: "Erro interno do servidor" });
}

export function rotaNaoEncontrada(_req: Request, res: Response): void {
  res.status(404).json({ mensagem: "Rota não encontrada" });
}
