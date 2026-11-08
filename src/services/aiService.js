import { assistantInstructions, knowledgeBase } from "../config/knowledgeBase.js";

export class AiServiceError extends Error {
  constructor(code, status = 502) {
    super(code);
    this.name = "AiServiceError";
    this.code = code;
    this.status = status;
  }
}

export function createAiService({
  fetchImpl = globalThis.fetch,
  env = process.env
} = {}) {
  return async function generateReply({ message, history }) {
    const apiKey = env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      throw new AiServiceError("AI_NOT_CONFIGURED", 503);
    }

    const baseUrl = (env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, "");
    let response;
    try {
      response = await fetchImpl(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: env.OPENAI_MODEL || "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `${assistantInstructions}\n\nBase de conhecimento:\n${knowledgeBase}`
            },
            ...history.map(({ role, content }) => ({ role, content })),
            { role: "user", content: message }
          ],
          temperature: 0.3,
          max_tokens: 500
        }),
        signal: AbortSignal.timeout(30_000)
      });
    } catch (error) {
      if (error?.name === "TimeoutError" || error?.name === "AbortError") {
        throw new AiServiceError("AI_TIMEOUT", 504);
      }
      throw new AiServiceError("AI_UNAVAILABLE", 502);
    }

    if (!response.ok) {
      throw new AiServiceError(
        response.status === 429 ? "AI_RATE_LIMITED" : "AI_PROVIDER_ERROR",
        response.status === 429 ? 503 : 502
      );
    }

    let payload;
    try {
      payload = await response.json();
    } catch {
      throw new AiServiceError("AI_INVALID_RESPONSE", 502);
    }

    const reply = payload?.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || !reply.trim()) {
      throw new AiServiceError("AI_INVALID_RESPONSE", 502);
    }
    return reply.trim();
  };
}

export const generateReply = createAiService();
