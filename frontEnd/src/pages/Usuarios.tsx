import { useState, type FormEvent } from "react";
import { UserCog, Check } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { api, mensagemErro } from "../lib/api";

export default function Usuarios() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState("ATENDENTE");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setEnviando(true);
    try {
      await api.post("/auth/usuarios", { nome, email, senha, cargo });
      setSucesso(`Funcionário ${nome} cadastrado com sucesso.`);
      setNome("");
      setEmail("");
      setSenha("");
      setCargo("ATENDENTE");
    } catch (err) {
      setErro(mensagemErro(err, "Não foi possível cadastrar o funcionário."));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Layout titulo="Funcionários">
      <Card className="max-w-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <UserCog size={20} className="text-accent" />
          <h2 className="font-display text-xl font-semibold">Cadastrar novo funcionário</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} required />
          <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Senha provisória" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required minLength={6} />
          <Select label="Cargo" value={cargo} onChange={(e) => setCargo(e.target.value)}>
            <option value="ATENDENTE">Atendente</option>
            <option value="MECANICO">Mecânico</option>
            <option value="ADMIN">Administrador</option>
          </Select>

          {erro && <p className="text-danger text-sm bg-danger-soft rounded-md px-3 py-2">{erro}</p>}
          {sucesso && (
            <p className="text-success text-sm bg-success-soft rounded-md px-3 py-2 flex items-center gap-2">
              <Check size={15} /> {sucesso}
            </p>
          )}

          <Button type="submit" disabled={enviando}>
            {enviando ? "Cadastrando..." : "Cadastrar funcionário"}
          </Button>
        </form>
      </Card>
    </Layout>
  );
}
