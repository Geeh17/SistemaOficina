import { useEffect, useState } from "react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { api, mensagemErro } from "../../lib/api";
import type { Cliente, Moto } from "../../types";

interface Props {
  aberto: boolean;
  onFechar: () => void;
  onSalvo: () => void;
}

export function AgendamentoFormModal({ aberto, onFechar, onSalvo }: Props) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [motos, setMotos] = useState<Moto[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [motoId, setMotoId] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [servico, setServico] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!aberto) return;
    api.get("/clientes").then((r) => setClientes(r.data)).catch(() => {});
  }, [aberto]);

  useEffect(() => {
    if (!clienteId) { setMotos([]); return; }
    api.get(`/motos?clienteId=${clienteId}`).then((r) => setMotos(r.data)).catch(() => {});
  }, [clienteId]);

  async function handleSubmit() {
    setErro("");
    if (!clienteId || !data || !hora || !servico) {
      setErro("Preencha cliente, data, horário e serviço.");
      return;
    }
    setEnviando(true);
    try {
      await api.post("/agendamentos", {
        clienteId,
        motoId: motoId || undefined,
        dataHora: new Date(`${data}T${hora}`).toISOString(),
        servico,
        observacoes: observacoes || undefined,
      });
      onSalvo();
      onFechar();
    } catch (err) {
      setErro(mensagemErro(err, "Não foi possível criar o agendamento."));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="Novo agendamento" largura="md">
      <div className="flex flex-col gap-4">
        <Select label="Cliente" value={clienteId} onChange={(e) => { setClienteId(e.target.value); setMotoId(""); }}>
          <option value="">Selecione o cliente</option>
          {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </Select>
        <Select label="Moto (opcional)" value={motoId} onChange={(e) => setMotoId(e.target.value)} disabled={!clienteId}>
          <option value="">Sem moto específica</option>
          {motos.map((m) => <option key={m.id} value={m.id}>{m.marca} {m.modelo}</option>)}
        </Select>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Data" type="date" value={data} onChange={(e) => setData(e.target.value)} />
          <Input label="Horário" type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
        </div>
        <Input label="Serviço" placeholder="Ex: Revisão dos 10.000km" value={servico} onChange={(e) => setServico(e.target.value)} />
        <Textarea label="Observações (opcional)" rows={2} value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />

        {erro && <p className="text-danger text-sm bg-danger-soft rounded-md px-3 py-2">{erro}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onFechar} type="button">Cancelar</Button>
          <Button onClick={handleSubmit} disabled={enviando} type="button">
            {enviando ? "Salvando..." : "Agendar"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
