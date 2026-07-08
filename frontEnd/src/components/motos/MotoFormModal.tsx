import { useEffect, useState } from "react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { api, mensagemErro } from "../../lib/api";
import type { Cliente, Moto } from "../../types";

interface Props {
  aberto: boolean;
  motoEditando: Moto | null;
  onFechar: () => void;
  onSalvo: () => void;
}

const VAZIO = { clienteId: "", marca: "", modelo: "", placa: "", ano: "", cor: "", cilindrada: "" };

export function MotoFormModal({ aberto, motoEditando, onFechar, onSalvo }: Props) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [form, setForm] = useState(VAZIO);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!aberto) return;
    api.get("/clientes").then((r) => setClientes(r.data)).catch(() => {});
  }, [aberto]);

  useEffect(() => {
    if (motoEditando) {
      setForm({
        clienteId: motoEditando.clienteId,
        marca: motoEditando.marca,
        modelo: motoEditando.modelo,
        placa: motoEditando.placa,
        ano: String(motoEditando.ano),
        cor: motoEditando.cor,
        cilindrada: String(motoEditando.cilindrada),
      });
    } else {
      setForm(VAZIO);
    }
    setErro("");
  }, [motoEditando, aberto]);

  function set<K extends keyof typeof VAZIO>(campo: K, valor: string) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function handleSubmit() {
    setErro("");
    if (!form.clienteId || !form.marca || !form.modelo || !form.placa) {
      setErro("Preencha cliente, marca, modelo e placa.");
      return;
    }
    setEnviando(true);
    const payload = {
      clienteId: form.clienteId,
      marca: form.marca,
      modelo: form.modelo,
      placa: form.placa,
      ano: Number(form.ano) || new Date().getFullYear(),
      cor: form.cor,
      cilindrada: Number(form.cilindrada) || 0,
    };
    try {
      if (motoEditando) {
        await api.put(`/motos/${motoEditando.id}`, payload);
      } else {
        await api.post("/motos", payload);
      }
      onSalvo();
      onFechar();
    } catch (err) {
      setErro(mensagemErro(err, "Não foi possível salvar a moto."));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo={motoEditando ? "Editar moto" : "Nova moto"} largura="md">
      <div className="flex flex-col gap-4">
        <Select label="Proprietário" value={form.clienteId} onChange={(e) => set("clienteId", e.target.value)}>
          <option value="">Selecione o cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </Select>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Marca" value={form.marca} onChange={(e) => set("marca", e.target.value)} />
          <Input label="Modelo" value={form.modelo} onChange={(e) => set("modelo", e.target.value)} />
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <Input label="Placa" value={form.placa} onChange={(e) => set("placa", e.target.value.toUpperCase())} />
          <Input label="Ano" type="number" value={form.ano} onChange={(e) => set("ano", e.target.value)} />
          <Input label="Cilindrada (cc)" type="number" value={form.cilindrada} onChange={(e) => set("cilindrada", e.target.value)} />
        </div>
        <Input label="Cor" value={form.cor} onChange={(e) => set("cor", e.target.value)} />

        {erro && <p className="text-danger text-sm bg-danger-soft rounded-md px-3 py-2">{erro}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onFechar} type="button">Cancelar</Button>
          <Button onClick={handleSubmit} disabled={enviando} type="button">
            {enviando ? "Salvando..." : "Salvar moto"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
