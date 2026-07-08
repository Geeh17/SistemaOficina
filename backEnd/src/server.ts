import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler, rotaNaoEncontrada } from "./middlewares/errorHandler";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? "*" }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", routes);

app.use(rotaNaoEncontrada);
app.use(errorHandler);

const PORT = process.env.PORT ?? 3333;

app.listen(PORT, () => {
  console.log(`🏍️  Sistema Oficina rodando em http://localhost:${PORT}`);
});
