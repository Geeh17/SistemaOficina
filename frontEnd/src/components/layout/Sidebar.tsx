import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Bike,
  PackageSearch,
  Wallet,
  CalendarDays,
  UserCog,
  Wrench,
} from "lucide-react";
import clsx from "clsx";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to: "/", label: "Painel", icon: LayoutDashboard, fim: true },
  { to: "/ordens", label: "Ordens de Serviço", icon: ClipboardList },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/motos", label: "Motos", icon: Bike },
  { to: "/estoque", label: "Estoque", icon: PackageSearch },
  { to: "/financeiro", label: "Financeiro", icon: Wallet },
  { to: "/agenda", label: "Agenda", icon: CalendarDays },
];

export function Sidebar() {
  const { usuario } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-surface border-r border-border-soft h-screen sticky top-0">
      <div className="flex items-center gap-2 px-5 h-16 border-b border-border-soft">
        <div className="bg-accent text-ink rounded p-1.5">
          <Wrench size={18} strokeWidth={2.5} />
        </div>
        <span className="font-display text-lg font-bold tracking-wide">
          OFICINA<span className="text-accent">.OS</span>
        </span>
      </div>

      <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
        {NAV.map(({ to, label, icon: Icon, fim }) => (
          <NavLink
            key={to}
            to={to}
            end={fim}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent-soft text-accent"
                  : "text-text-muted hover:text-text hover:bg-surface-raised"
              )
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}

        {usuario?.cargo === "ADMIN" && (
          <NavLink
            to="/usuarios"
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent-soft text-accent"
                  : "text-text-muted hover:text-text hover:bg-surface-raised"
              )
            }
          >
            <UserCog size={17} />
            Funcionários
          </NavLink>
        )}
      </nav>

      <div className="px-4 py-3 border-t border-border-soft text-xs text-text-faint">
        Sistema Oficina — v1.0
      </div>
    </aside>
  );
}
