import { Router } from "express";
import {
  criarOrdemServico,
  listarOrdensServico,
  getOrdemServicoPorId,
  updateStatusOrdemServico,
} from "../controllers/ordemServico.controller";
import { finalizarOrdemServico } from "../controllers/finalizarOrdem.controller";

const router = Router();

router.post("/", criarOrdemServico);
router.get("/", listarOrdensServico);
router.get("/:id", getOrdemServicoPorId);
router.patch("/status/:id", updateStatusOrdemServico);
router.patch("/finalizar/:id", finalizarOrdemServico);

export default router;
