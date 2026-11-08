import "dotenv/config";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createChatRouter } from "./routes/chatRoutes.js";
import { generateReply } from "./services/aiService.js";

const app = express();
const port = Number.parseInt(process.env.PORT || "3000", 10);
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const publicDirectory = path.resolve(currentDirectory, "../public");

app.disable("x-powered-by");
app.use(helmet());
app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", aiConfigured: Boolean(process.env.OPENAI_API_KEY?.trim()) });
});

app.use(
  "/api/chat",
  rateLimit({
    windowMs: 60_000,
    limit: 12,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
      error: {
        code: "RATE_LIMITED",
        message: "Você enviou muitas mensagens. Aguarde um minuto e tente novamente."
      }
    }
  }),
  createChatRouter(generateReply)
);

app.use(express.static(publicDirectory, { extensions: ["html"] }));

app.use((error, _req, res, _next) => {
  if (error?.type === "entity.too.large") {
    return res.status(413).json({
      error: { code: "PAYLOAD_TOO_LARGE", message: "A solicitação enviada é muito grande." }
    });
  }
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({
      error: { code: "INVALID_JSON", message: "O corpo da solicitação não contém JSON válido." }
    });
  }
  console.error("[server] Erro inesperado ao processar a solicitação.");
  return res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Ocorreu um erro inesperado." }
  });
});

app.listen(port, () => {
  console.log(`Nexus Suporte e Serviços disponível em http://localhost:${port}`);
});
