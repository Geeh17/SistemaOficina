import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../lib/api";
import type { Usuario } from "../types";

interface AuthContextValue {
  usuario: Usuario | null;
  carregando: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const salvo = localStorage.getItem("@oficina:usuario");
    const token = localStorage.getItem("@oficina:token");
    if (salvo && token) {
      setUsuario(JSON.parse(salvo));
    }
    setCarregando(false);
  }, []);

  async function login(email: string, senha: string) {
    const { data } = await api.post("/auth/login", { email, senha });
    localStorage.setItem("@oficina:token", data.token);
    localStorage.setItem("@oficina:usuario", JSON.stringify(data.usuario));
    setUsuario(data.usuario);
  }

  function logout() {
    localStorage.removeItem("@oficina:token");
    localStorage.removeItem("@oficina:usuario");
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
