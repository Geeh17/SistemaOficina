import { useEffect, useMemo, useState } from "react";
import { Plus, ClipboardList } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { Button } from "../components/ui/Button";
import { SearchInput } from "../components/ui/SearchInput";
import { Loader } from "../components/ui/Loader";
import { EmptyState } from "../components/ui/EmptyState";
import { OSTicketCard } from "../components/os/OSTicketCard";
import { OSFormModal } from "../components/os/OSFormModal";
import { OSDetailModal } from "../components/os/OSDetailModal";
import { api } from "../lib/api";
import type { OrdemServico, StatusOS } from "../types";
import { STATUS_OS_LABEL, STATUS_OS_ORDEM } from "../lib/format";

export default function OrdensServico() {
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [osSelecionada, setOsSelecionada] = useState<OrdemServico | null>(null);

  async function carregar() {
    setCarregando(true);
    try {
      const { data } = await api.get("/ordens-servico");
      setOrdens(data);
    } catch {
      setOrdens([]);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const ordensFiltradas = useMemo(() => {
    if (!busca) return ordens;
    const termo = busca.toLowerCase();
    return ordens.filter(
      (o) =>
        o.cliente?.nome?.toLowerCase().includes(termo) ||
        o.moto?.placa?.toLowerCase().includes(termo) ||
        String(o.numero).includes(termo)
    );
  }, [ordens, busca]);

  const colunas = STATUS_OS_ORDEM as StatusOS[];

  return (
    <Layout
      titulo="Ordens de Serviço"
      acoes={
        <div className="flex items-center gap-2">
          <SearchInput
            placeholder="Buscar por cliente, placa ou nº"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <Button icon={<Plus size={16} />} onClick={() => setModalAberto(true)}>
            Nova OS
          </Button>
        </div>
      }
    >
      {carregando ? (
        <Loader label="Carregando ordens de serviço..." />
      ) : ordens.length === 0 ? (
        <EmptyState
          icone={<ClipboardList size={40} />}
          titulo="Nenhuma OS aberta"
          descricao="Quando um cliente trouxer uma moto para reparo, abra a primeira ordem de serviço aqui."
          acao={
            <Button icon={<Plus size={16} />} onClick={() => setModalAberto(true)}>
              Abrir primeira OS
            </Button>
          }
        />
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1">
          {colunas.map((status) => {
            const itens = ordensFiltradas.filter((o) => o.status === status);
            return (
              <div key={status} className="w-72 shrink-0 flex flex-col">
                <div className="flex items-center justify-between mb-3 px-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    {STATUS_OS_LABEL[status]}
                  </p>
                  <span className="text-xs font-mono text-text-faint bg-surface-raised rounded-full w-5 h-5 flex items-center justify-center">
                    {itens.length}
                  </span>
                </div>
                <div className="flex flex-col gap-2.5 min-h-[120px] bg-surface/40 rounded-lg p-2 border border-dashed border-border-soft">
                  {itens.map((os) => (
                    <OSTicketCard key={os.id} os={os} onClick={() => setOsSelecionada(os)} />
                  ))}
                  {itens.length === 0 && (
                    <p className="text-center text-text-faint text-xs py-6">Nenhuma OS aqui</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <OSFormModal aberto={modalAberto} onFechar={() => setModalAberto(false)} onCriada={carregar} />
      <OSDetailModal
        os={osSelecionada}
        onFechar={() => setOsSelecionada(null)}
        onAtualizada={() => {
          carregar();
          setOsSelecionada(null);
        }}
      />
    </Layout>
  );
}
