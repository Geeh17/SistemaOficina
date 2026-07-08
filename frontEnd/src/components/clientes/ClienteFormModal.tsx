import { useEffect, useState } from "react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { api, mensagemErro } from "../../lib/api";
import type { Cliente } from "../../types";

interface Props {
  aberto: boolean;
  clienteEditando: Cliente | null;
  onFechar: () => void;
  onSalvo: () => void;
}

const VAZIO = {
  nome: "",
  cpfCnpj: "",
  telefone: "",
  email: "",
  rua: "",
  numero: "",
  bairro: "",
  cidade: "",
  estado: "",
  cep: "",
};

export function ClienteFormModal({ aberto, clienteEditando, onFechar, onSalvo }: Props) {
  const [form, setForm] = useState(VAZIO);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (clienteEditando) {
      setForm({
        nome: clienteEditando.nome,
        cpfCnpj: clienteEditando.cpfCnpj,
        telefone: clienteEditando.telefone,
        email: clienteEditando.email ?? "",
        rua: clienteEditando.endereco?.rua ?? "",
        numero: clienteEditando.endereco?.numero ?? "",
        bairro: clienteEditando.endereco?.bairro ?? "",
        cidade: clienteEditando.endereco?.cidade ?? "",
        estado: clienteEditando.endereco?.estado ?? "",
        cep: clienteEditando.endereco?.cep ?? "",
      });
    } else {
      setForm(VAZIO);
    }
    setErro("");
  }, [clienteEditando, aberto]);

  function set<K extends keyof typeof VAZIO>(campo: K, valor: string) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function handleSubmit() {
    setErro("");
    if (!form.nome || !form.cpfCnpj || !form.telefone) {
      setErro("Preencha nome, CPF/CNPJ e telefone.");
      return;
    }
    setEnviando(true);
    const payload = {
      nome: form.nome,
      cpfCnpj: form.cpfCnpj,
      telefone: form.telefone,
      email: form.email || undefined,
      endereco: {
        rua: form.rua,
        numero: form.numero,
        bairro: form.bairro,
        cidade: form.cidade,
        estado: form.estado,
        cep: form.cep,
      },
    };
    try {
      if (clienteEditando) {
        await api.put(`/clientes/${clienteEditando.id}`, payload);
      } else {
        await api.post("/clientes", payload);
      }
      onSalvo();
      onFechar();
    } catch (err) {
      setErro(mensagemErro(err, "Não foi possível salvar o cliente."));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo={clienteEditando ? "Editar cliente" : "Novo cliente"} largura="md">
      <div className="flex flex-col gap-4">
        <Input label="Nome completo" value={form.nome} onChange={(e) => set("nome", e.target.value)} />
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="CPF / CNPJ" value={form.cpfCnpj} onChange={(e) => set("cpfCnpj", e.target.value)} />
          <Input label="Telefone" value={form.telefone} onChange={(e) => set("telefone", e.target.value)} />
        </div>
        <Input label="E-mail (opcional)" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />

        <p className="text-xs font-semibold text-text-faint uppercase tracking-wide mt-1">Endereço</p>
        <div className="grid sm:grid-cols-3 gap-4">
          <Input label="Rua" className="sm:col-span-2" value={form.rua} onChange={(e) => set("rua", e.target.value)} />
          <Input label="Número" value={form.numero} onChange={(e) => set("numero", e.target.value)} />
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <Input label="Bairro" value={form.bairro} onChange={(e) => set("bairro", e.target.value)} />
          <Input label="Cidade" value={form.cidade} onChange={(e) => set("cidade", e.target.value)} />
          <Input label="UF" maxLength={2} value={form.estado} onChange={(e) => set("estado", e.target.value.toUpperCase())} />
        </div>
        <Input label="CEP" value={form.cep} onChange={(e) => set("cep", e.target.value)} />

        {erro && <p className="text-danger text-sm bg-danger-soft rounded-md px-3 py-2">{erro}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onFechar} type="button">Cancelar</Button>
          <Button onClick={handleSubmit} disabled={enviando} type="button">
            {enviando ? "Salvando..." : "Salvar cliente"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
