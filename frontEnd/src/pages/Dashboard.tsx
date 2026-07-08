import { useEffect, useState } from "react";
import { ClipboardList, Wallet, PackageX, TrendingUp, CalendarClock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { StatCard } from "../components/ui/StatCard";
import { Card } from "../components/ui/Card";
import { Loader } from "../components/ui/Loader";
import { EmptyState } from "../components/ui/EmptyState";
import { api } from "../lib/api";
import type { ResumoDashboard } from "../types";
import { formatarMoeda, formatarDataHora, STATUS_OS_LABEL } from "../lib/format";

export default function Dashboard() {
  const [resumo, setResumo] = useState<ResumoDashboard | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api
      .get("/dashboard/resumo")
      .then((r) => setResumo(r.data))
      .catch(() => setResumo(null))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <Layout titulo="Painel">
      {carregando ? (
        <Loader label="Carregando painel..." />
      ) : !resumo ? (
        <EmptyState
          icone={<ClipboardList size={40} />}
          titulo="Não foi possível carregar o painel"
          descricao="Verifique se a API do backend está no ar e configurada em VITE_API_URL."
        />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="OS em andamento"
              valor={String(resumo.ordensAbertas)}
              icone={<ClipboardList size={20} />}
              tom="accent"
              legenda="Aguardando conclusão"
            />
            <StatCard
              label="Faturamento do mês"
              valor={formatarMoeda(resumo.faturamentoMes)}
              icone={<TrendingUp size={20} />}
              tom="success"
              legenda={`Saldo: ${formatarMoeda(resumo.saldoMes)}`}
            />
            <StatCard
              label="Despesas do mês"
              valor={formatarMoeda(resumo.despesasMes)}
              icone={<Wallet size={20} />}
              tom="danger"
            />
            <StatCard
              label="Peças em estoque baixo"
              valor={String(resumo.pecasEstoqueBaixo)}
              icone={<PackageX size={20} />}
              tom="warning"
              legenda="Repor o quanto antes"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-semibold">Baias por status</h2>
                <Link to="/ordens" className="text-accent text-sm flex items-center gap-1 hover:underline">
                  Ver painel completo <ArrowRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {resumo.ordensPorStatus.map((item) => (
                  <div key={item.status} className="bg-surface-raised rounded-md p-3">
                    <p className="text-xs text-text-faint">{STATUS_OS_LABEL[item.status]}</p>
                    <p className="font-display text-2xl font-bold mt-1">{item._count._all}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-semibold">Próximos agendamentos</h2>
                <Link to="/agenda" className="text-accent text-sm flex items-center gap-1 hover:underline">
                  Agenda <ArrowRight size={14} />
                </Link>
              </div>
              {resumo.proximosAgendamentos.length === 0 ? (
                <p className="text-text-faint text-sm">Nenhum agendamento futuro.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {resumo.proximosAgendamentos.map((a) => (
                    <div key={a.id} className="flex items-start gap-2.5">
                      <CalendarClock size={15} className="text-text-faint mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{a.cliente?.nome}</p>
                        <p className="text-xs text-text-faint">{formatarDataHora(a.dataHora)} · {a.servico}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </Layout>
  );
}
