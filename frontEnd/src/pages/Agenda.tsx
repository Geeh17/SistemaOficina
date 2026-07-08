import { useEffect, useState } from "react";
import { Plus, CalendarDays, Bike, X } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { Button } from "../components/ui/Button";
import { Loader } from "../components/ui/Loader";
import { EmptyState } from "../components/ui/EmptyState";
import { Card } from "../components/ui/Card";
import { BadgeStatusAgendamento } from "../components/ui/Badge";
import { AgendamentoFormModal } from "../components/agenda/AgendamentoFormModal";
import { api } from "../lib/api";
import type { Agendamento } from "../types";
import { formatarDataHora } from "../lib/format";

export default function Agenda() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

  async function carregar() {
    setCarregando(true);
    try {
      const { data } = await api.get("/agendamentos");
      setAgendamentos(data);
    } catch {
      setAgendamentos([]);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function mudarStatus(id: string, status: string) {
    try {
      await api.put(`/agendamentos/${id}`, { status });
      carregar();
    } catch {
      alert("Não foi possível atualizar o agendamento.");
    }
  }

  return (
    <Layout
      titulo="Agenda"
      acoes={
        <Button icon={<Plus size={16} />} onClick={() => setModalAberto(true)}>
          Novo agendamento
        </Button>
      }
    >
      {carregando ? (
        <Loader label="Carregando agenda..." />
      ) : agendamentos.length === 0 ? (
        <EmptyState
          icone={<CalendarDays size={40} />}
          titulo="Nenhum agendamento"
          descricao="Marque horários para clientes trazerem a moto para manutenção."
          acao={<Button icon={<Plus size={16} />} onClick={() => setModalAberto(true)}>Novo agendamento</Button>}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {agendamentos.map((a) => (
            <Card key={a.id} className="p-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="bg-surface-raised rounded-md px-3 py-2 text-center min-w-[64px]">
                  <p className="font-display text-xl font-bold leading-none">
                    {new Date(a.dataHora).toLocaleDateString("pt-BR", { day: "2-digit" })}
                  </p>
                  <p className="text-[10px] text-text-faint uppercase mt-0.5">
                    {new Date(a.dataHora).toLocaleDateString("pt-BR", { month: "short" })}
                  </p>
                </div>
                <div>
                  <p className="font-medium">{a.cliente?.nome}</p>
                  <p className="text-sm text-text-muted">{a.servico}</p>
                  <div className="flex items-center gap-3 text-xs text-text-faint mt-1">
                    <span>{formatarDataHora(a.dataHora)}</span>
                    {a.moto && (
                      <span className="flex items-center gap-1">
                        <Bike size={12} /> {a.moto.marca} {a.moto.modelo}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BadgeStatusAgendamento status={a.status} />
                {a.status === "AGENDADO" && (
                  <>
                    <Button size="sm" variant="secondary" onClick={() => mudarStatus(a.id, "CONFIRMADO")}>Confirmar</Button>
                    <button onClick={() => mudarStatus(a.id, "CANCELADO")} className="text-text-faint hover:text-danger p-1.5">
                      <X size={16} />
                    </button>
                  </>
                )}
                {a.status === "CONFIRMADO" && (
                  <Button size="sm" variant="secondary" onClick={() => mudarStatus(a.id, "CONCLUIDO")}>Concluir</Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <AgendamentoFormModal aberto={modalAberto} onFechar={() => setModalAberto(false)} onSalvo={carregar} />
    </Layout>
  );
}
