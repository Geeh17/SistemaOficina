import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { RotaProtegida } from "./components/layout/RotaProtegida";
import { RotaAdmin } from "./components/layout/RotaAdmin";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import OrdensServico from "./pages/OrdensServico";
import Clientes from "./pages/Clientes";
import Motos from "./pages/Motos";
import Estoque from "./pages/Estoque";
import Financeiro from "./pages/Financeiro";
import Agenda from "./pages/Agenda";
import Usuarios from "./pages/Usuarios";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RotaProtegida><Dashboard /></RotaProtegida>} />
          <Route path="/ordens" element={<RotaProtegida><OrdensServico /></RotaProtegida>} />
          <Route path="/clientes" element={<RotaProtegida><Clientes /></RotaProtegida>} />
          <Route path="/motos" element={<RotaProtegida><Motos /></RotaProtegida>} />
          <Route path="/estoque" element={<RotaProtegida><Estoque /></RotaProtegida>} />
          <Route path="/financeiro" element={<RotaProtegida><Financeiro /></RotaProtegida>} />
          <Route path="/agenda" element={<RotaProtegida><Agenda /></RotaProtegida>} />
          <Route
            path="/usuarios"
            element={
              <RotaProtegida>
                <RotaAdmin>
                  <Usuarios />
                </RotaAdmin>
              </RotaProtegida>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
