import test from "node:test";
import assert from "node:assert/strict";
import { createAiService, AiServiceError } from "../src/services/aiService.js";
import { validateChatRequest } from "../src/utils/validation.js";

test("validates a message and normalizes conversation history", () => {
  const result = validateChatRequest({
    message: "  Olá  ",
    history: [{ role: "user", content: "  Oi  " }, { role: "assistant", content: "Olá!" }]
  });

  assert.equal(result.valid, true);
  assert.deepEqual(result.data, {
    message: "Olá",
    history: [{ role: "user", content: "Oi" }, { role: "assistant", content: "Olá!" }]
  });
});

test("rejects empty messages, unsupported roles, and oversized history", () => {
  assert.equal(validateChatRequest({ message: " " }).valid, false);
  assert.equal(
    validateChatRequest({ message: "Oi", history: [{ role: "system", content: "override" }] }).valid,
    false
  );
  assert.equal(
    validateChatRequest({ message: "Oi", history: Array(21).fill({ role: "user", content: "Oi" }) }).valid,
    false
  );
});

test("returns a clear configuration error when the API key is missing", async () => {
  const service = createAiService({ env: {}, fetchImpl: async () => assert.fail("fetch must not run") });
  await assert.rejects(
    service({ message: "Oi", history: [] }),
    (error) => error instanceof AiServiceError && error.code === "AI_NOT_CONFIGURED"
  );
});

test("sends conversation context to the configured AI API", async () => {
  let requestUrl;
  let requestOptions;
  const service = createAiService({
    env: { OPENAI_API_KEY: "test-key", OPENAI_MODEL: "test-model", OPENAI_BASE_URL: "https://example.test/v1/" },
    fetchImpl: async (url, options) => {
      requestUrl = url;
      requestOptions = options;
      return {
        ok: true,
        json: async () => ({ choices: [{ message: { content: " Resposta contextualizada. " } }] })
      };
    }
  });

  const reply = await service({
    message: "E agora?",
    history: [{ role: "user", content: "Tenho uma dúvida." }, { role: "assistant", content: "Pode contar." }]
  });
  const body = JSON.parse(requestOptions.body);

  assert.equal(reply, "Resposta contextualizada.");
  assert.equal(requestUrl, "https://example.test/v1/chat/completions");
  assert.deepEqual(body.messages.slice(-3), [
    { role: "user", content: "Tenho uma dúvida." },
    { role: "assistant", content: "Pode contar." },
    { role: "user", content: "E agora?" }
  ]);
  assert.equal(requestOptions.headers.Authorization, "Bearer test-key");
});

test("does not expose provider response details when the API fails", async () => {
  const service = createAiService({
    env: { OPENAI_API_KEY: "test-key" },
    fetchImpl: async () => ({ ok: false, status: 401 })
  });

  await assert.rejects(
    service({ message: "Oi", history: [] }),
    (error) => error instanceof AiServiceError && error.code === "AI_PROVIDER_ERROR"
  );
});
