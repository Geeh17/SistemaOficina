import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import {
  ordemServicoSchema,
  atualizarOrdemServicoSchema,
  atualizarStatusSchema,
} from "../schemas/ordemServico.schema";
import { ApiError } from "../utils/ApiError";
import { gerarNumeroOS } from "../utils/gerarNumeroOS";

function calcularTotal(servicos: { preco: number }[], pecas: { quantidade: number; precoUnitario: number }[]) {
  const totalServicos = servicos.reduce((acc, s) => acc + s.preco, 0);
  const totalPecas = pecas.reduce((acc, p) => acc + p.quantidade * p.precoUnitario, 0);
  return totalServicos + totalPecas;
}

export const criarOrdemServico = async (req: Request, res: Response): Promise<void> => {
  const data = ordemServicoSchema.parse(req.body);
  const total = calcularTotal(data.servicos, data.pecas);
  const numero = await gerarNumeroOS();

  const novaOS = await prisma.ordemServico.create({
    data: {
      numero,
      clienteId: data.clienteId,
      motoId: data.motoId,
      quilometragem: data.quilometragem,
      problema: data.problema,
      diagnostico: data.diagnostico ?? null,
      status: data.status,
      servicos: data.servicos,
      pecas: data.pecas,
      total,
      formaPagamento: data.formaPagamento,
      valorPago: data.valorPago,
      troco: data.troco,
      dataPrevisao: data.dataPrevisao,
      observacoes: data.observacoes ?? null,
      dataEntrada: new Date(),
    },
    include: { cliente: true, moto: true },
  });

  // Baixa automática das peças informadas que existem no estoque cadastrado
  for (const peca of data.pecas) {
    if (!peca.pecaId) continue;
    await prisma.peca.update({
      where: { id: peca.pecaId },
      data: { quantidade: { decrement: peca.quantidade } },
    });
    await prisma.movimentacaoEstoque.create({
      data: {
        pecaId: peca.pecaId,
        tipo: "SAIDA",
        quantidade: peca.quantidade,
        motivo: `Uso na OS #${numero}`,
        ordemServicoId: novaOS.id,
      },
    });
  }

  res.status(201).json(novaOS);
};

export const listarOrdensServico = async (req: Request, res: Response): Promise<void> => {
  const { status, clienteId, motoId } = req.query;

  const ordens = await prisma.ordemServico.findMany({
    where: {
      status: status ? (String(status) as any) : undefined,
      clienteId: clienteId ? String(clienteId) : undefined,
      motoId: motoId ? String(motoId) : undefined,
    },
    include: { cliente: true, moto: true },
    orderBy: { dataEntrada: "desc" },
  });

  res.status(200).json(ordens);
};

export const getOrdemServicoPorId = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const ordem = await prisma.ordemServico.findUnique({
    where: { id },
    include: { cliente: true, moto: true },
  });

  if (!ordem) throw new ApiError(404, "Ordem de serviço não encontrada");
  res.status(200).json(ordem);
};

export const atualizarOrdemServico = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const data = atualizarOrdemServicoSchema.parse(req.body);

  let total: number | undefined;
  if (data.servicos && data.pecas) {
    total = calcularTotal(data.servicos, data.pecas);
  }

  const ordem = await prisma.ordemServico.update({
    where: { id },
    data: { ...data, ...(total !== undefined ? { total } : {}) },
    include: { cliente: true, moto: true },
  });

  res.status(200).json(ordem);
};

export const updateStatusOrdemServico = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = atualizarStatusSchema.parse(req.body);

  const ordemAtualizada = await prisma.ordemServico.update({
    where: { id },
    data: {
      status,
      dataSaida: status === "ENTREGUE" ? new Date() : undefined,
    },
    include: { cliente: true, moto: true },
  });

  // Ao marcar como ENTREGUE, lança automaticamente a receita no financeiro
  if (status === "ENTREGUE" && ordemAtualizada.total > 0) {
    const jaExiste = await prisma.transacao.findFirst({
      where: { ordemServicoId: id },
    });
    if (!jaExiste) {
      await prisma.transacao.create({
        data: {
          tipo: "RECEITA",
          categoria: "Ordem de Serviço",
          descricao: `Recebimento da OS #${ordemAtualizada.numero}`,
          valor: ordemAtualizada.total,
          formaPagamento: ordemAtualizada.formaPagamento ?? undefined,
          ordemServicoId: id,
        },
      });
    }
  }

  res.status(200).json(ordemAtualizada);
};

export const removerOrdemServico = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await prisma.ordemServico.delete({ where: { id } });
  res.status(204).send();
};
