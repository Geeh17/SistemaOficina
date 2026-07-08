import { useEffect, useMemo, useState } from "react";
import { Plus, Users, Pencil, Trash2, Bike, Phone } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { Button } from "../components/ui/Button";
import { SearchInput } from "../components/ui/SearchInput";
import { Loader } from "../components/ui/Loader";
import { EmptyState } from "../components/ui/EmptyState";
import { Card } from "../components/ui/Card";
import { ClienteFormModal } from "../components/clientes/ClienteFormModal";
import { api } from "../lib/api";
import type { Cliente } from "../types";
import { formatarTelefone } from "../lib/format";

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<Cliente | null>(null);

  async function carregar() {
    setCarregando(true);
    try {
      const { data } = await api.get("/clientes");
      setClientes(data);
    } catch {
      setClientes([]);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const filtrados = useMemo(() => {
    if (!busca) return clientes;
    const termo = busca.toLowerCase();
    return clientes.filter(
      (c) => c.nome.toLowerCase().includes(termo) || c.cpfCnpj.includes(termo) || c.telefone.includes(termo)
    );
  }, [clientes, busca]);

  async function excluir(id: string) {
    if (!confirm("Remover este cliente? Essa ação não pode ser desfeita.")) return;
    try {
      await api.delete(`/clientes/${id}`);
      carregar();
    } catch {
      alert("Não foi possível remover o cliente.");
    }
  }

  return (
    <Layout
      titulo="Clientes"
      acoes={
        <div className="flex items-center gap-2">
          <SearchInput placeholder="Buscar por nome, CPF ou telefone" value={busca} onChange={(e) => setBusca(e.target.value)} />
          <Button icon={<Plus size={16} />} onClick={() => { setEditando(null); setModalAberto(true); }}>
            Novo cliente
          </Button>
        </div>
      }
    >
      {carregando ? (
        <Loader label="Carregando clientes..." />
      ) : filtrados.length === 0 ? (
        <EmptyState
          icone={<Users size={40} />}
          titulo="Nenhum cliente cadastrado"
          descricao="Cadastre o primeiro cliente para começar a abrir ordens de serviço."
          acao={<Button icon={<Plus size={16} />} onClick={() => setModalAberto(true)}>Novo cliente</Button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtrados.map((c) => (
            <Card key={c.id} className="p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{c.nome}</p>
                  <p className="text-xs text-text-faint font-mono">{c.cpfCnpj}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditando(c); setModalAberto(true); }} className="text-text-faint hover:text-accent p-1.5">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => excluir(c.id)} className="text-text-faint hover:text-danger p-1.5">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Phone size={13} className="text-text-faint" />
                {formatarTelefone(c.telefone)}
              </div>
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Bike size={13} className="text-text-faint" />
                {c.motos?.length ?? 0} moto(s) cadastrada(s)
              </div>
            </Card>
          ))}
        </div>
      )}

      <ClienteFormModal
        aberto={modalAberto}
        clienteEditando={editando}
        onFechar={() => setModalAberto(false)}
        onSalvo={carregar}
      />
    </Layout>
  );
}
