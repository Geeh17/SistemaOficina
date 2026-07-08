import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Wrench, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { mensagemErro } from "../lib/api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      await login(email, senha);
      navigate("/");
    } catch (err) {
      setErro(mensagemErro(err, "E-mail ou senha inválidos"));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-4 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 1px, transparent 12px)",
        }}
      />

      <div className="w-full max-w-sm relative">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-accent text-ink rounded-lg p-3 mb-3">
            <Wrench size={28} strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-wide">
            OFICINA<span className="text-accent">.OS</span>
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Painel de gestão da oficina
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-border-soft rounded-lg p-6 flex flex-col gap-4"
        >
          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          {erro && (
            <div className="flex items-center gap-2 text-danger text-sm bg-danger-soft rounded-md px-3 py-2">
              <AlertCircle size={15} />
              {erro}
            </div>
          )}

          <Button type="submit" disabled={carregando} className="mt-2 w-full">
            {carregando ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <p className="text-center text-text-faint text-xs mt-6">
          Acesso restrito à equipe da oficina.
        </p>
      </div>
    </div>
  );
}
