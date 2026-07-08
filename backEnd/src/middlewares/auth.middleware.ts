import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";

export interface UsuarioAutenticado {
  id: string;
  nome: string;
  email: string;
  cargo: "ADMIN" | "MECANICO" | "ATENDENTE";
}

declare global {
  namespace Express {
    interface Request {
      usuario?: UsuarioAutenticado;
    }
  }
}

export function autenticar(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new ApiError(401, "Token de acesso não informado");
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as UsuarioAutenticado;

    req.usuario = payload;
    next();
  } catch {
    throw new ApiError(401, "Token inválido ou expirado");
  }
}

export function autorizar(...cargosPermitidos: UsuarioAutenticado["cargo"][]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.usuario) {
      throw new ApiError(401, "Não autenticado");
    }
    if (!cargosPermitidos.includes(req.usuario.cargo)) {
      throw new ApiError(403, "Você não tem permissão para essa ação");
    }
    next();
  };
}
