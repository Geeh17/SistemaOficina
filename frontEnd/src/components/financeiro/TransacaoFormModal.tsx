import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { api, mensagemErro } from "../../lib/api";
import { FORMA_PAGAMENTO_LABEL } from "../../lib/format";

interface Props {
  aberto: boolean;
  onFechar: () => void;
  onSalvo: () => void;
}

export function TransacaoFormModal({ aberto, onFechar, onSalvo }: Props) {
  const [tipo, setTipo] = useState<"RECEITA" | "DESPESA">("DESPESA");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("DINHEIRO");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  function resetar() {
    setTipo("DESPESA");
    setCategoria("");
    setDescricao("");
    setValor("");
    setErro("");
  }

  async function handleSubmit() {
    setErro("");
    if (!categoria || !descricao || !valor) {
      setErro("Preencha categoria, descrição e valor.");
      return;
    }
    setEnviando(true);
    try {
      await api.post("/transacoes", {
        tipo,
        categoria,
        descricao,
        valor: Number(valor),
        formaPagamento,
      });
      resetar();
      onSalvo();
      onFechar();
    } catch (err) {
      setErro(mensagemErro(err, "Não foi possível registrar o lançamento."));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="Novo lançamento" largura="sm">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTipo("RECEITA")}
            className={`flex-1 py-2 rounded-md text-sm font-semibold border ${tipo === "RECEITA" ? "bg-success-soft text-success border-success/30" : "border-border text-text-muted"}`}
          >
            Receita
          </button>
          <button
            type="button"
            onClick={() => setTipo("DESPESA")}
            className={`flex-1 py-2 rounded-md text-sm font-semibold border ${tipo === "DESPESA" ? "bg-danger-soft text-danger border-danger/30" : "border-border text-text-muted"}`}
          >
            Despesa
          </button>
        </div>

        <Input label="Categoria" placeholder="Ex: Fornecedores, Aluguel, Peças" value={categoria} onChange={(e) => setCategoria(e.target.value)} />
        <Input label="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        <Input label="Valor" type="number" min={0} step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} />
        <Select label="Forma de pagamento" value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)}>
          {Object.entries(FORMA_PAGAMENTO_LABEL).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </Select>

        {erro && <p className="text-danger text-sm bg-danger-soft rounded-md px-3 py-2">{erro}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onFechar} type="button">Cancelar</Button>
          <Button onClick={handleSubmit} disabled={enviando} type="button">
            {enviando ? "Salvando..." : "Registrar lançamento"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
