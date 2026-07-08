import { Router } from "express";
import {
  criarPeca,
  listarPecas,
  getPecaPorId,
  atualizarPeca,
  removerPeca,
  movimentarEstoque,
} from "../controllers/peca.controller";
import { autenticar, autorizar } from "../middlewares/auth.middleware";

const router = Router();

router.use(autenticar);

router.post("/", criarPeca);
router.get("/", listarPecas);
router.get("/:id", getPecaPorId);
router.put("/:id", atualizarPeca);
router.delete("/:id", autorizar("ADMIN"), removerPeca);
router.post("/:id/movimentacoes", movimentarEstoque);

export default router;
