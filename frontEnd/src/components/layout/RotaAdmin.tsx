import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function RotaAdmin({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();
  if (usuario?.cargo !== "ADMIN") {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
