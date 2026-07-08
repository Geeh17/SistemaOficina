import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { api, mensagemErro } from "../../lib/api";
import type { Cliente, ItemPeca, ItemServico, Moto } from "../../types";
import { formatarMoeda, formatarPlaca } from "../../lib/format";

interface Props {
  aberto: boolean;
  onFechar: () => void;
  onCriada: () => void;
}

export function OSFormModal({ aberto, onFechar, onCriada }: Props) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [motos, setMotos] = useState<Moto[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [motoId, setMotoId] = useState("");
  const [quilometragem, setQuilometragem] = useState("");
  const [problema, setProblema] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [servicos, setServicos] = useState<ItemServico[]>([{ nome: "", preco: 0 }]);
  const [pecas, setPecas] = useState<ItemPeca[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!aberto) return;
    api.get("/clientes").then((r) => setClientes(r.data)).catch(() => {});
  }, [aberto]);

  useEffect(() => {
    if (!clienteId) {
      setMotos([]);
      return;
    }
    api.get(`/motos?clienteId=${clienteId}`).then((r) => setMotos(r.data)).catch(() => {});
  }, [clienteId]);

  function resetar() {
    setClienteId("");
    setMotoId("");
    setQuilometragem("");
    setProblema("");
    setDiagnostico("");
    setServicos([{ nome: "", preco: 0 }]);
    setPecas([]);
    setErro("");
  }

  const totalServicos = servicos.reduce((a, s) => a + (Number(s.preco) || 0), 0);
  const totalPecas = pecas.reduce((a, p) => a + (Number(p.quantidade) || 0) * (Number(p.precoUnitario) || 0), 0);
  const total = totalServicos + totalPecas;

  async function handleSubmit() {
    setErro("");
    if (!clienteId || !motoId || !problema || servicos.every((s) => !s.nome)) {
      setErro("Preencha cliente, moto, problema relatado e ao menos um serviço.");
      return;
    }
    setEnviando(true);
    try {
      await api.post("/ordens-servico", {
        clienteId,
        motoId,
        quilometragem: Number(quilometragem) || 0,
        problema,
        diagnostico: diagnostico || undefined,
        status: "ABERTA",
        servicos: servicos.filter((s) => s.nome),
        pecas: pecas.filter((p) => p.nome),
        valorPago: 0,
        troco: 0,
      });
      resetar();
      onCriada();
      onFechar();
    } catch (err) {
      setErro(mensagemErro(err, "Não foi possível abrir a OS."));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="Nova Ordem de Serviço" largura="lg">
      <div className="flex flex-col gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Select label="Cliente" value={clienteId} onChange={(e) => { setClienteId(e.target.value); setMotoId(""); }}>
            <option value="">Selecione o cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </Select>
          <Select label="Moto" value={motoId} onChange={(e) => setMotoId(e.target.value)} disabled={!clienteId}>
            <option value="">{clienteId ? "Selecione a moto" : "Selecione o cliente primeiro"}</option>
            {motos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.marca} {m.modelo} · {formatarPlaca(m.placa)}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Input
            label="Quilometragem"
            type="number"
            min={0}
            value={quilometragem}
            onChange={(e) => setQuilometragem(e.target.value)}
            className="sm:col-span-1"
          />
        </div>

        <Textarea
          label="Problema relatado pelo cliente"
          rows={2}
          value={problema}
          onChange={(e) => setProblema(e.target.value)}
        />
        <Textarea
          label="Diagnóstico inicial (opcional)"
          rows={2}
          value={diagnostico}
          onChange={(e) => setDiagnostico(e.target.value)}
        />

        {/* Serviços */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-text-muted">Serviços</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              icon={<Plus size={14} />}
              onClick={() => setServicos((s) => [...s, { nome: "", preco: 0 }])}
            >
              Adicionar
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {servicos.map((s, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  className="flex-1 bg-surface-raised border border-border rounded-md px-3 py-2 text-sm focus:border-accent outline-none"
                  placeholder="Ex: Troca de óleo"
                  value={s.nome}
                  onChange={(e) => setServicos((arr) => arr.map((x, idx) => (idx === i ? { ...x, nome: e.target.value } : x)))}
                />
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  className="w-28 bg-surface-raised border border-border rounded-md px-3 py-2 text-sm font-mono focus:border-accent outline-none"
                  placeholder="R$ 0,00"
                  value={s.preco || ""}
                  onChange={(e) => setServicos((arr) => arr.map((x, idx) => (idx === i ? { ...x, preco: Number(e.target.value) } : x)))}
                />
                <button
                  type="button"
                  onClick={() => setServicos((arr) => arr.filter((_, idx) => idx !== i))}
                  className="text-text-faint hover:text-danger p-1.5"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Peças */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-text-muted">Peças utilizadas</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              icon={<Plus size={14} />}
              onClick={() => setPecas((p) => [...p, { nome: "", quantidade: 1, precoUnitario: 0 }])}
            >
              Adicionar
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {pecas.map((p, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  className="flex-1 bg-surface-raised border border-border rounded-md px-3 py-2 text-sm focus:border-accent outline-none"
                  placeholder="Ex: Pastilha de freio"
                  value={p.nome}
                  onChange={(e) => setPecas((arr) => arr.map((x, idx) => (idx === i ? { ...x, nome: e.target.value } : x)))}
                />
                <input
                  type="number"
                  min={1}
                  className="w-16 bg-surface-raised border border-border rounded-md px-2 py-2 text-sm font-mono focus:border-accent outline-none"
                  value={p.quantidade}
                  onChange={(e) => setPecas((arr) => arr.map((x, idx) => (idx === i ? { ...x, quantidade: Number(e.target.value) } : x)))}
                />
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  className="w-28 bg-surface-raised border border-border rounded-md px-3 py-2 text-sm font-mono focus:border-accent outline-none"
                  placeholder="Unit."
                  value={p.precoUnitario || ""}
                  onChange={(e) => setPecas((arr) => arr.map((x, idx) => (idx === i ? { ...x, precoUnitario: Number(e.target.value) } : x)))}
                />
                <button
                  type="button"
                  onClick={() => setPecas((arr) => arr.filter((_, idx) => idx !== i))}
                  className="text-text-faint hover:text-danger p-1.5"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            {pecas.length === 0 && (
              <p className="text-xs text-text-faint">Nenhuma peça adicionada ainda.</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between bg-surface-raised rounded-md px-4 py-3">
          <span className="text-sm font-medium text-text-muted">Total estimado</span>
          <span className="font-mono text-xl font-bold text-accent">{formatarMoeda(total)}</span>
        </div>

        {erro && <p className="text-danger text-sm bg-danger-soft rounded-md px-3 py-2">{erro}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onFechar} type="button">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={enviando} type="button">
            {enviando ? "Abrindo..." : "Abrir Ordem de Serviço"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
