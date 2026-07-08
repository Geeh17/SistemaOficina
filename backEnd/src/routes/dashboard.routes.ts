import { Router } from "express";
import { resumoDashboard } from "../controllers/dashboard.controller";
import { autenticar } from "../middlewares/auth.middleware";

const router = Router();

router.use(autenticar);
router.get("/resumo", resumoDashboard);

export default router;
