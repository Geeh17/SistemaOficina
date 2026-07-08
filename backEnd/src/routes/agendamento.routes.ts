import { Router } from "express";
import {
  criarAgendamento,
  listarAgendamentos,
  atualizarAgendamento,
  removerAgendamento,
} from "../controllers/agendamento.controller";
import { autenticar } from "../middlewares/auth.middleware";

const router = Router();

router.use(autenticar);

router.post("/", criarAgendamento);
router.get("/", listarAgendamentos);
router.put("/:id", atualizarAgendamento);
router.delete("/:id", removerAgendamento);

export default router;
