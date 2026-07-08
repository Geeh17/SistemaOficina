import { useState } from "react";
import { Check, User, Bike, Gauge, Calendar } from "lucide-react";
import clsx from "clsx";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { api, mensagemErro } from "../../lib/api";
import type { OrdemServico, StatusOS } from "../../types";
import {
  formatarMoeda,
  formatarData,
  formatarPlaca,
  STATUS_OS_LABEL,
  STATUS_OS_ORDEM,
  FORMA_PAGAMENTO_LABEL,
} from "../../lib/format";
import { BadgeStatusOS } from "../ui/Badge";

interface Props {
  os: OrdemServico | null;
  onFechar: () => void;
  onAtualizada: () => void;
}

export function OSDetailModal({ os, onFechar, onAtualizada }: Props) {
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("DINHEIRO");

  if (!os) return null;

  async function mudarStatus(novoStatus: StatusOS) {
    setErro("");
    setAtualizando(true);
    try {
      await api.patch(`/ordens-servico/${os!.id}/status`, { status: novoStatus });
      if (novoStatus === "ENTREGUE") {
        await api.put(`/ordens-servico/${os!.id}`, {
          formaPagamento,
          valorPago: os!.total,
          troco: 0,
        });
      }
      onAtualizada();
    } catch (err) {
      setErro(mensagemErro(err, "Não foi possível atualizar o status."));
    } finally {
      setAtualizando(false);
    }
  }

  const indiceAtual = STATUS_OS_ORDEM.indexOf(os.status);

  return (
    <Modal aberto={!!os} onFechar={onFechar} titulo={`OS-${String(os.numero).padStart(4, "0")}`} largura="lg">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <BadgeStatusOS status={os.status} />
          <span className="text-xs text-text-faint flex items-center gap-1">
            <Calendar size={13} /> Entrada em {formatarData(os.dataEntrada)}
          </span>
        </div>

        {/* Stepper de status */}
        {os.status !== "CANCELADA" && (
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {STATUS_OS_ORDEM.map((s, i) => (
              <div key={s} className="flex items-center flex-1 min-w-fit">
                <div
                  className={clsx(
                    "h-1.5 flex-1 rounded-full min-w-[24px]",
                    i <= indiceAtual ? "bg-accent" : "bg-surface-raised"
                  )}
                />
                {i < STATUS_OS_ORDEM.length - 1 && <div className="w-1" />}
              </div>
            ))}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4 bg-surface-raised rounded-md p-4">
          <div className="flex items-start gap-2">
            <User size={15} className="text-text-faint mt-0.5" />
            <div>
              <p className="text-xs text-text-faint">Cliente</p>
              <p className="text-sm font-medium">{os.cliente?.nome}</p>
              <p className="text-xs text-text-muted">{os.cliente?.telefone}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Bike size={15} className="text-text-faint mt-0.5" />
            <div>
              <p className="text-xs text-text-faint">Moto</p>
              <p className="text-sm font-medium">
                {os.moto?.marca} {os.moto?.modelo} ({os.moto?.ano})
              </p>
              <p className="text-xs text-text-muted font-mono">{formatarPlaca(os.moto?.placa ?? "")}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Gauge size={15} className="text-text-faint mt-0.5" />
            <div>
              <p className="text-xs text-text-faint">Quilometragem</p>
              <p className="text-sm font-medium">{os.quilometragem.toLocaleString("pt-BR")} km</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs text-text-faint mb-1">Problema relatado</p>
          <p className="text-sm text-text">{os.problema}</p>
        </div>
        {os.diagnostico && (
          <div>
            <p className="text-xs text-text-faint mb-1">Diagnóstico</p>
            <p className="text-sm text-text">{os.diagnostico}</p>
          </div>
        )}

        <div>
          <p className="text-xs text-text-faint mb-2">Serviços e peças</p>
          <div className="flex flex-col gap-1.5 text-sm">
            {os.servicos.map((s, i) => (
              <div key={`s${i}`} className="flex justify-between">
                <span className="text-text-muted">{s.nome}</span>
                <span className="font-mono">{formatarMoeda(s.preco)}</span>
              </div>
            ))}
            {os.pecas.map((p, i) => (
              <div key={`p${i}`} className="flex justify-between">
                <span className="text-text-muted">
                  {p.nome} <span className="text-text-faint">× {p.quantidade}</span>
                </span>
                <span className="font-mono">{formatarMoeda(p.quantidade * p.precoUnitario)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-2 mt-2 border-t border-border-soft">
            <span className="font-semibold">Total</span>
            <span className="font-mono font-bold text-accent text-lg">{formatarMoeda(os.total)}</span>
          </div>
        </div>

        {erro && <p className="text-danger text-sm bg-danger-soft rounded-md px-3 py-2">{erro}</p>}

        {os.status !== "ENTREGUE" && os.status !== "CANCELADA" && (
          <div className="flex flex-col gap-3 pt-2 border-t border-border-soft">
            {indiceAtual === STATUS_OS_ORDEM.length - 1 && (
              <Select
                label="Forma de pagamento na entrega"
                value={formaPagamento}
                onChange={(e) => setFormaPagamento(e.target.value)}
              >
                {Object.entries(FORMA_PAGAMENTO_LABEL).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </Select>
            )}
            <div className="flex flex-wrap gap-2 justify-end">
              <Button variant="danger" onClick={() => mudarStatus("CANCELADA")} disabled={atualizando} type="button">
                Cancelar OS
              </Button>
              {indiceAtual < STATUS_OS_ORDEM.length - 1 ? (
                <Button
                  onClick={() => mudarStatus(STATUS_OS_ORDEM[indiceAtual + 1] as StatusOS)}
                  disabled={atualizando}
                  icon={<Check size={15} />}
                  type="button"
                >
                  Avançar para {STATUS_OS_LABEL[STATUS_OS_ORDEM[indiceAtual + 1]]}
                </Button>
              ) : (
                <Button onClick={() => mudarStatus("ENTREGUE")} disabled={atualizando} icon={<Check size={15} />} type="button">
                  Confirmar entrega e receber
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
