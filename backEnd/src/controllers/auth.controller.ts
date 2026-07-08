import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { loginSchema, criarUsuarioSchema } from "../schemas/auth.schema";
import { ApiError } from "../utils/ApiError";

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, senha } = loginSchema.parse(req.body);

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario || !usuario.ativo) {
    throw new ApiError(401, "E-mail ou senha inválidos");
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) {
    throw new ApiError(401, "E-mail ou senha inválidos");
  }

  const token = jwt.sign(
    {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      cargo: usuario.cargo,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "12h" }
  );

  res.status(200).json({
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      cargo: usuario.cargo,
    },
  });
};

// Cadastro de funcionários - protegido, apenas ADMIN pode chamar (ver rotas)
export const criarUsuario = async (req: Request, res: Response): Promise<void> => {
  const data = criarUsuarioSchema.parse(req.body);

  const senhaHash = await bcrypt.hash(data.senha, 10);

  const usuario = await prisma.usuario.create({
    data: { ...data, senha: senhaHash },
  });

  res.status(201).json({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    cargo: usuario.cargo,
  });
};

export const me = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json(req.usuario);
};
