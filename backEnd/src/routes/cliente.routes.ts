import { Router } from "express";
import {
  criarCliente,
  listarClientes,
  getClientePorId,
  atualizarCliente,
  removerCliente,
} from "../controllers/cliente.controller";
import { autenticar, autorizar } from "../middlewares/auth.middleware";

const router = Router();

router.use(autenticar);

router.post("/", criarCliente);
router.get("/", listarClientes);
router.get("/:id", getClientePorId);
router.put("/:id", atualizarCliente);
router.delete("/:id", autorizar("ADMIN"), removerCliente);

export default router;
