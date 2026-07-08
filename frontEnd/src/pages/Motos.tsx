import { useEffect, useMemo, useState } from "react";
import { Plus, Bike, Pencil, Trash2 } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { Button } from "../components/ui/Button";
import { SearchInput } from "../components/ui/SearchInput";
import { Loader } from "../components/ui/Loader";
import { EmptyState } from "../components/ui/EmptyState";
import { MotoFormModal } from "../components/motos/MotoFormModal";
import { api } from "../lib/api";
import type { Moto } from "../types";
import { formatarPlaca } from "../lib/format";

export default function Motos() {
  const [motos, setMotos] = useState<Moto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<Moto | null>(null);

  async function carregar() {
    setCarregando(true);
    try {
      const { data } = await api.get("/motos");
      setMotos(data);
    } catch {
      setMotos([]);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const filtradas = useMemo(() => {
    if (!busca) return motos;
    const termo = busca.toLowerCase();
    return motos.filter(
      (m) => m.placa.toLowerCase().includes(termo) || m.modelo.toLowerCase().includes(termo) || m.marca.toLowerCase().includes(termo)
    );
  }, [motos, busca]);

  async function excluir(id: string) {
    if (!confirm("Remover esta moto?")) return;
    try {
      await api.delete(`/motos/${id}`);
      carregar();
    } catch {
      alert("Não foi possível remover a moto.");
    }
  }

  return (
    <Layout
      titulo="Motos"
      acoes={
        <div className="flex items-center gap-2">
          <SearchInput placeholder="Buscar por placa, marca ou modelo" value={busca} onChange={(e) => setBusca(e.target.value)} />
          <Button icon={<Plus size={16} />} onClick={() => { setEditando(null); setModalAberto(true); }}>
            Nova moto
          </Button>
        </div>
      }
    >
      {carregando ? (
        <Loader label="Carregando motos..." />
      ) : filtradas.length === 0 ? (
        <EmptyState
          icone={<Bike size={40} />}
          titulo="Nenhuma moto cadastrada"
          descricao="Cadastre a moto de um cliente para vincular ordens de serviço a ela."
          acao={<Button icon={<Plus size={16} />} onClick={() => setModalAberto(true)}>Nova moto</Button>}
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border-soft">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-raised text-text-faint text-xs uppercase tracking-wide text-left">
                <th className="px-4 py-3 font-semibold">Placa</th>
                <th className="px-4 py-3 font-semibold">Marca / Modelo</th>
                <th className="px-4 py-3 font-semibold">Ano</th>
                <th className="px-4 py-3 font-semibold">Cor</th>
                <th className="px-4 py-3 font-semibold">Proprietário</th>
                <th className="px-4 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((m) => (
                <tr key={m.id} className="border-t border-border-soft hover:bg-surface-raised/50">
                  <td className="px-4 py-3 font-mono">{formatarPlaca(m.placa)}</td>
                  <td className="px-4 py-3">{m.marca} {m.modelo} <span className="text-text-faint">· {m.cilindrada}cc</span></td>
                  <td className="px-4 py-3">{m.ano}</td>
                  <td className="px-4 py-3">{m.cor}</td>
                  <td className="px-4 py-3">{m.cliente?.nome ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => { setEditando(m); setModalAberto(true); }} className="text-text-faint hover:text-accent p-1.5">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => excluir(m.id)} className="text-text-faint hover:text-danger p-1.5">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <MotoFormModal aberto={modalAberto} motoEditando={editando} onFechar={() => setModalAberto(false)} onSalvo={carregar} />
    </Layout>
  );
}
