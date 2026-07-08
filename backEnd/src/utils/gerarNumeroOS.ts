import { prisma } from "../lib/prisma";

// Gera o próximo número sequencial de Ordem de Serviço.
// Em MongoDB o Prisma não tem autoincrement nativo, então mantemos
// o maior número existente e incrementamos.
export async function gerarNumeroOS(): Promise<number> {
  const ultima = await prisma.ordemServico.findFirst({
    orderBy: { numero: "desc" },
    select: { numero: true },
  });
  return (ultima?.numero ?? 0) + 1;
}
