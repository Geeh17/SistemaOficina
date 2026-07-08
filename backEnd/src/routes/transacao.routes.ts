import { Router } from "express";
import {
  criarTransacao,
  listarTransacoes,
  resumoFinanceiro,
  removerTransacao,
} from "../controllers/transacao.controller";
import { autenticar, autorizar } from "../middlewares/auth.middleware";

const router = Router();

router.use(autenticar);

router.post("/", criarTransacao);
router.get("/", listarTransacoes);
router.get("/resumo", resumoFinanceiro);
router.delete("/:id", autorizar("ADMIN"), removerTransacao);

export default router;
