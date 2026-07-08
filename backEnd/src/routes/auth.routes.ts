import { Router } from "express";
import { login, criarUsuario, me } from "../controllers/auth.controller";
import { autenticar, autorizar } from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", login);
router.get("/me", autenticar, me);
router.post("/usuarios", autenticar, autorizar("ADMIN"), criarUsuario);

export default router;
