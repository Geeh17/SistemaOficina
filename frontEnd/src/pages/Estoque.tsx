import { useEffect, useMemo, useState } from "react";
import { Plus, PackageSearch, Pencil, Trash2, ArrowDownCircle, ArrowUpCircle, AlertTriangle } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { Button } from "../components/ui/Button";
import { SearchInput } from "../components/ui/SearchInput";
import { Loader } from "../components/ui/Loader";
import { EmptyState } from "../components/ui/EmptyState";
import { PecaFormModal } from "../components/estoque/PecaFormModal";
import { api } from "../lib/api";
import type { Peca } from "../types";
import { formatarMoeda } from "../lib/format";
import clsx from "clsx";

export default function Estoque() {
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<Peca | null>(null);
  const [somenteBaixo, setSomenteBaixo] = useState(false);

  async function carregar() {
    setCarregando(true);
    try {
      const { data } = await api.get("/pecas");
      setPecas(data);
    } catch {
      setPecas([]);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const filtradas = useMemo(() => {
    let lista = pecas;
    if (somenteBaixo) lista = lista.filter((p) => p.quantidade <= p.quantidadeMinima);
    if (!busca) return lista;
    const termo = busca.toLowerCase();
    return lista.filter(
      (p) => p.nome.toLowerCase().includes(termo) || p.codigo.toLowerCase().includes(termo) || p.categoria.toLowerCase().includes(termo)
    );
  }, [pecas, busca, somenteBaixo]);

  async function movimentar(id: string, tipo: "ENTRADA" | "SAIDA") {
    const quantidade = Number(prompt(`Quantidade a dar ${tipo === "ENTRADA" ? "entrada" : "saída"}:`, "1"));
    if (!quantidade || quantidade <= 0) return;
    const motivo = prompt("Motivo da movimentação:", tipo === "ENTRADA" ? "Compra de fornecedor" : "Ajuste manual") || "Ajuste manual";
    try {
      await api.post(`/pecas/${id}/movimentacoes`, { tipo, quantidade, motivo });
      carregar();
    } catch {
      alert("Não foi possível registrar a movimentação.");
    }
  }

  async function excluir(id: string) {
    if (!confirm("Remover esta peça do catálogo?")) return;
    try {
      await api.delete(`/pecas/${id}`);
      carregar();
    } catch {
      alert("Não foi possível remover a peça.");
    }
  }

  return (
    <Layout
      titulo="Estoque de peças"
      acoes={
        <div className="flex items-center gap-2">
          <SearchInput placeholder="Buscar por nome, código ou categoria" value={busca} onChange={(e) => setBusca(e.target.value)} />
          <Button icon={<Plus size={16} />} onClick={() => { setEditando(null); setModalAberto(true); }}>
            Nova peça
          </Button>
        </div>
      }
    >
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setSomenteBaixo((v) => !v)}
          className={clsx(
            "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors",
            somenteBaixo ? "bg-warning-soft text-warning border-warning/30" : "text-text-muted border-border hover:bg-surface-raised"
          )}
        >
          <AlertTriangle size={13} /> Estoque baixo
        </button>
      </div>

      {carregando ? (
        <Loader label="Carregando estoque..." />
      ) : filtradas.length === 0 ? (
        <EmptyState
          icone={<PackageSearch size={40} />}
          titulo="Nenhuma peça encontrada"
          descricao="Cadastre as peças usadas na oficina para controlar o estoque e vinculá-las às ordens de serviço."
          acao={<Button icon={<Plus size={16} />} onClick={() => setModalAberto(true)}>Nova peça</Button>}
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border-soft">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-raised text-text-faint text-xs uppercase tracking-wide text-left">
                <th className="px-4 py-3 font-semibold">Peça</th>
                <th className="px-4 py-3 font-semibold">Categoria</th>
                <th className="px-4 py-3 font-semibold">Qtd.</th>
                <th className="px-4 py-3 font-semibold">Preço venda</th>
                <th className="px-4 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((p) => {
                const baixo = p.quantidade <= p.quantidadeMinima;
                return (
                  <tr key={p.id} className="border-t border-border-soft hover:bg-surface-raised/50">
                    <td className="px-4 py-3">
                      <p className="font-medium">{p.nome}</p>
                      <p className="text-xs text-text-faint font-mono">{p.codigo}</p>
                    </td>
                    <td className="px-4 py-3 text-text-muted">{p.categoria}</td>
                    <td className="px-4 py-3">
                      <span className={clsx("font-mono font-semibold", baixo ? "text-danger" : "text-text")}>
                        {p.quantidade}
                      </span>
                      <span className="text-text-faint text-xs"> / mín. {p.quantidadeMinima}</span>
                    </td>
                    <td className="px-4 py-3 font-mono">{formatarMoeda(p.precoVenda)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => movimentar(p.id, "ENTRADA")} className="text-text-faint hover:text-success p-1.5" title="Entrada">
                          <ArrowDownCircle size={16} />
                        </button>
                        <button onClick={() => movimentar(p.id, "SAIDA")} className="text-text-faint hover:text-warning p-1.5" title="Saída">
                          <ArrowUpCircle size={16} />
                        </button>
                        <button onClick={() => { setEditando(p); setModalAberto(true); }} className="text-text-faint hover:text-accent p-1.5">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => excluir(p.id)} className="text-text-faint hover:text-danger p-1.5">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <PecaFormModal aberto={modalAberto} pecaEditando={editando} onFechar={() => setModalAberto(false)} onSalvo={carregar} />
    </Layout>
  );
}
