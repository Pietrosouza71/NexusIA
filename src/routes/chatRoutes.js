import { Router } from "express";
import { AiServiceError } from "../services/aiService.js";
import { validateChatRequest } from "../utils/validation.js";

export function createChatRouter(generateReply) {
  const router = Router();

  router.post("/", async (req, res) => {
    const validation = validateChatRequest(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        error: {
          code: "INVALID_REQUEST",
          message: validation.message
        }
      });
    }

    try {
      const reply = await generateReply(validation.data);
      return res.json({ reply });
    } catch (error) {
      if (error instanceof AiServiceError) {
        if (error.status >= 500) {
          console.error(`[ai] ${error.code}`);
        }
        const messages = {
          AI_NOT_CONFIGURED: "O atendimento inteligente ainda não está configurado. Consulte um atendente.",
          AI_TIMEOUT: "A resposta está demorando mais que o esperado. Tente novamente em instantes.",
          AI_RATE_LIMITED: "O serviço está ocupado no momento. Tente novamente em alguns instantes.",
          AI_UNAVAILABLE: "Não foi possível conectar ao serviço de atendimento. Tente novamente.",
          AI_PROVIDER_ERROR: "O serviço de atendimento está temporariamente indisponível.",
          AI_INVALID_RESPONSE: "Não foi possível preparar uma resposta. Tente novamente."
        };
        return res.status(error.status).json({
          error: {
            code: error.code,
            message: messages[error.code] || "Não foi possível responder agora. Tente novamente."
          }
        });
      }

      console.error("[chat] Erro inesperado ao gerar resposta.");
      return res.status(500).json({
        error: {
          code: "INTERNAL_ERROR",
          message: "Ocorreu um erro inesperado. Tente novamente."
        }
      });
    }
  });

  return router;
}
