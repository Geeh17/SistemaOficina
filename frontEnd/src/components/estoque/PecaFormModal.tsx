import { useEffect, useState } from "react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { api, mensagemErro } from "../../lib/api";
import type { Peca } from "../../types";

interface Props {
  aberto: boolean;
  pecaEditando: Peca | null;
  onFechar: () => void;
  onSalvo: () => void;
}

const VAZIO = {
  nome: "", codigo: "", categoria: "", quantidade: "0", quantidadeMinima: "2",
  precoCusto: "", precoVenda: "", fornecedor: "",
};

export function PecaFormModal({ aberto, pecaEditando, onFechar, onSalvo }: Props) {
  const [form, setForm] = useState(VAZIO);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (pecaEditando) {
      setForm({
        nome: pecaEditando.nome,
        codigo: pecaEditando.codigo,
        categoria: pecaEditando.categoria,
        quantidade: String(pecaEditando.quantidade),
        quantidadeMinima: String(pecaEditando.quantidadeMinima),
        precoCusto: String(pecaEditando.precoCusto),
        precoVenda: String(pecaEditando.precoVenda),
        fornecedor: pecaEditando.fornecedor ?? "",
      });
    } else {
      setForm(VAZIO);
    }
    setErro("");
  }, [pecaEditando, aberto]);

  function set<K extends keyof typeof VAZIO>(campo: K, valor: string) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function handleSubmit() {
    setErro("");
    if (!form.nome || !form.codigo || !form.categoria || !form.precoVenda) {
      setErro("Preencha nome, código, categoria e preço de venda.");
      return;
    }
    setEnviando(true);
    const payload = {
      nome: form.nome,
      codigo: form.codigo,
      categoria: form.categoria,
      quantidade: Number(form.quantidade) || 0,
      quantidadeMinima: Number(form.quantidadeMinima) || 0,
      precoCusto: Number(form.precoCusto) || 0,
      precoVenda: Number(form.precoVenda) || 0,
      fornecedor: form.fornecedor || undefined,
    };
    try {
      if (pecaEditando) {
        await api.put(`/pecas/${pecaEditando.id}`, payload);
      } else {
        await api.post("/pecas", payload);
      }
      onSalvo();
      onFechar();
    } catch (err) {
      setErro(mensagemErro(err, "Não foi possível salvar a peça."));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo={pecaEditando ? "Editar peça" : "Nova peça"} largura="md">
      <div className="flex flex-col gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Nome" value={form.nome} onChange={(e) => set("nome", e.target.value)} />
          <Input label="Código / SKU" value={form.codigo} onChange={(e) => set("codigo", e.target.value)} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Categoria" value={form.categoria} onChange={(e) => set("categoria", e.target.value)} />
          <Input label="Fornecedor (opcional)" value={form.fornecedor} onChange={(e) => set("fornecedor", e.target.value)} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Quantidade em estoque" type="number" min={0} value={form.quantidade} onChange={(e) => set("quantidade", e.target.value)} />
          <Input label="Estoque mínimo" type="number" min={0} value={form.quantidadeMinima} onChange={(e) => set("quantidadeMinima", e.target.value)} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Preço de custo" type="number" min={0} step="0.01" value={form.precoCusto} onChange={(e) => set("precoCusto", e.target.value)} />
          <Input label="Preço de venda" type="number" min={0} step="0.01" value={form.precoVenda} onChange={(e) => set("precoVenda", e.target.value)} />
        </div>

        {erro && <p className="text-danger text-sm bg-danger-soft rounded-md px-3 py-2">{erro}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onFechar} type="button">Cancelar</Button>
          <Button onClick={handleSubmit} disabled={enviando} type="button">
            {enviando ? "Salvando..." : "Salvar peça"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
