import { type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function Layout({
  titulo,
  acoes,
  children,
}: {
  titulo: string;
  acoes?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-ink">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Topbar titulo={titulo} acoes={acoes} />
        <main className="p-4 sm:p-6 max-w-[1400px] mx-auto">{children}</main>
      </div>
    </div>
  );
}
