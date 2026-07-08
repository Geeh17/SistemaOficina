import { Router } from "express";
import authRoutes from "./auth.routes";
import clienteRoutes from "./cliente.routes";
import motoRoutes from "./moto.routes";
import ordemServicoRoutes from "./ordemServico.routes";
import pecaRoutes from "./peca.routes";
import transacaoRoutes from "./transacao.routes";
import agendamentoRoutes from "./agendamento.routes";
import dashboardRoutes from "./dashboard.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/clientes", clienteRoutes);
router.use("/motos", motoRoutes);
router.use("/ordens-servico", ordemServicoRoutes);
router.use("/pecas", pecaRoutes);
router.use("/transacoes", transacaoRoutes);
router.use("/agendamentos", agendamentoRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
