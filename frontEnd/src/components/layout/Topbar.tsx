import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LogOut, Menu, User, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";

const CARGO_LABEL: Record<string, string> = {
  ADMIN: "Administrador",
  MECANICO: "Mecânico",
  ATENDENTE: "Atendente",
};

const NAV_MOBILE = [
  { to: "/", label: "Painel", fim: true },
  { to: "/ordens", label: "Ordens de Serviço" },
  { to: "/clientes", label: "Clientes" },
  { to: "/motos", label: "Motos" },
  { to: "/estoque", label: "Estoque" },
  { to: "/financeiro", label: "Financeiro" },
  { to: "/agenda", label: "Agenda" },
];

export function Topbar({ titulo, acoes }: { titulo: string; acoes?: React.ReactNode }) {
  const { usuario, logout } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 sm:px-6 border-b border-border-soft bg-ink/90 backdrop-blur">
      <div className="flex items-center gap-3">
        <button className="lg:hidden text-text-muted" onClick={() => setMenuAberto((v) => !v)} aria-label="Abrir menu">
          {menuAberto ? <X size={20} /> : <Menu size={20} />}
        </button>
        <h1 className="font-display text-2xl font-semibold tracking-wide">{titulo}</h1>
      </div>

      <div className="flex items-center gap-3">
        {acoes}
        <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-border-soft">
          <div className="bg-surface-raised rounded-full p-1.5 text-text-muted">
            <User size={16} />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium">{usuario?.nome}</p>
            <p className="text-xs text-text-faint">{usuario ? CARGO_LABEL[usuario.cargo] : ""}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={logout} icon={<LogOut size={15} />}>
          Sair
        </Button>
      </div>

      {menuAberto && (
        <nav className="lg:hidden absolute top-16 left-0 right-0 bg-surface border-b border-border-soft flex flex-col p-3 gap-1 shadow-xl">
          {NAV_MOBILE.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.fim}
              onClick={() => setMenuAberto(false)}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-md text-sm font-medium ${
                  isActive ? "bg-accent-soft text-accent" : "text-text-muted hover:bg-surface-raised"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
