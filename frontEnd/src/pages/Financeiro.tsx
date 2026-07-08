import { useEffect, useState } from "react";
import { Plus, Wallet, TrendingUp, TrendingDown, Trash2 } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { Button } from "../components/ui/Button";
import { Loader } from "../components/ui/Loader";
import { EmptyState } from "../components/ui/EmptyState";
import { StatCard } from "../components/ui/StatCard";
import { BadgeTipoTransacao } from "../components/ui/Badge";
import { TransacaoFormModal } from "../components/financeiro/TransacaoFormModal";
import { api } from "../lib/api";
import type { Transacao } from "../types";
import { formatarMoeda, formatarData } from "../lib/format";

export default function Financeiro() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [resumo, setResumo] = useState<{ receitas: number; despesas: number; saldo: number } | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

  async function carregar() {
    setCarregando(true);
    try {
      const [t, r] = await Promise.all([api.get("/transacoes"), api.get("/transacoes/resumo")]);
      setTransacoes(t.data);
      setResumo(r.data);
    } catch {
      setTransacoes([]);
      setResumo(null);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function excluir(id: string) {
    if (!confirm("Remover este lançamento?")) return;
    try {
      await api.delete(`/transacoes/${id}`);
      carregar();
    } catch {
      alert("Não foi possível remover o lançamento.");
    }
  }

  return (
    <Layout
      titulo="Financeiro"
      acoes={
        <Button icon={<Plus size={16} />} onClick={() => setModalAberto(true)}>
          Novo lançamento
        </Button>
      }
    >
      {carregando ? (
        <Loader label="Carregando financeiro..." />
      ) : (
        <div className="flex flex-col gap-6">
          {resumo && (
            <div className="grid sm:grid-cols-3 gap-4">
              <StatCard label="Receitas" valor={formatarMoeda(resumo.receitas)} icone={<TrendingUp size={20} />} tom="success" />
              <StatCard label="Despesas" valor={formatarMoeda(resumo.despesas)} icone={<TrendingDown size={20} />} tom="danger" />
              <StatCard label="Saldo" valor={formatarMoeda(resumo.saldo)} icone={<Wallet size={20} />} tom="accent" />
            </div>
          )}

          {transacoes.length === 0 ? (
            <EmptyState
              icone={<Wallet size={40} />}
              titulo="Nenhum lançamento ainda"
              descricao="Receitas de OS entregues entram aqui automaticamente. Registre despesas manualmente."
              acao={<Button icon={<Plus size={16} />} onClick={() => setModalAberto(true)}>Novo lançamento</Button>}
            />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border-soft">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-raised text-text-faint text-xs uppercase tracking-wide text-left">
                    <th className="px-4 py-3 font-semibold">Data</th>
                    <th className="px-4 py-3 font-semibold">Tipo</th>
                    <th className="px-4 py-3 font-semibold">Categoria</th>
                    <th className="px-4 py-3 font-semibold">Descrição</th>
                    <th className="px-4 py-3 font-semibold text-right">Valor</th>
                    <th className="px-4 py-3 font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {transacoes.map((t) => (
                    <tr key={t.id} className="border-t border-border-soft hover:bg-surface-raised/50">
                      <td className="px-4 py-3 text-text-muted">{formatarData(t.data)}</td>
                      <td className="px-4 py-3"><BadgeTipoTransacao tipo={t.tipo} /></td>
                      <td className="px-4 py-3 text-text-muted">{t.categoria}</td>
                      <td className="px-4 py-3">{t.descricao}</td>
                      <td className={`px-4 py-3 text-right font-mono font-semibold ${t.tipo === "RECEITA" ? "text-success" : "text-danger"}`}>
                        {t.tipo === "RECEITA" ? "+" : "-"} {formatarMoeda(t.valor)}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => excluir(t.id)} className="text-text-faint hover:text-danger p-1.5">
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <TransacaoFormModal aberto={modalAberto} onFechar={() => setModalAberto(false)} onSalvo={carregar} />
    </Layout>
  );
}
