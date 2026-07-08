import { Router } from "express";
import {
  criarOrdemServico,
  listarOrdensServico,
  getOrdemServicoPorId,
  atualizarOrdemServico,
  updateStatusOrdemServico,
  removerOrdemServico,
} from "../controllers/ordemServico.controller";
import { autenticar, autorizar } from "../middlewares/auth.middleware";

const router = Router();

router.use(autenticar);

router.post("/", criarOrdemServico);
router.get("/", listarOrdensServico);
router.get("/:id", getOrdemServicoPorId);
router.put("/:id", atualizarOrdemServico);
router.patch("/:id/status", updateStatusOrdemServico);
router.delete("/:id", autorizar("ADMIN"), removerOrdemServico);

export default router;
