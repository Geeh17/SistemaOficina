import { Router } from "express";
import {
  criarMoto,
  listarMotos,
  getMotoPorId,
  atualizarMoto,
  removerMoto,
} from "../controllers/moto.controller";
import { autenticar, autorizar } from "../middlewares/auth.middleware";

const router = Router();

router.use(autenticar);

router.post("/", criarMoto);
router.get("/", listarMotos);
router.get("/:id", getMotoPorId);
router.put("/:id", atualizarMoto);
router.delete("/:id", autorizar("ADMIN"), removerMoto);

export default router;
