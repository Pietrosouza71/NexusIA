const MAX_MESSAGE_LENGTH = 4_000;
const MAX_HISTORY_MESSAGES = 20;

export function validateChatRequest(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { valid: false, message: "Envie uma mensagem válida." };
  }

  if (typeof body.message !== "string") {
    return { valid: false, message: "A mensagem precisa ser um texto." };
  }
  const message = body.message.trim();
  if (!message) {
    return { valid: false, message: "Digite uma mensagem antes de enviar." };
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return { valid: false, message: "A mensagem deve ter no máximo 4.000 caracteres." };
  }

  const history = body.history ?? [];
  if (!Array.isArray(history) || history.length > MAX_HISTORY_MESSAGES) {
    return { valid: false, message: "O histórico da conversa é inválido." };
  }

  const normalizedHistory = [];
  for (const item of history) {
    if (
      !item ||
      typeof item !== "object" ||
      !["user", "assistant"].includes(item.role) ||
      typeof item.content !== "string" ||
      !item.content.trim() ||
      item.content.length > MAX_MESSAGE_LENGTH
    ) {
      return { valid: false, message: "O histórico da conversa contém uma mensagem inválida." };
    }
    normalizedHistory.push({ role: item.role, content: item.content.trim() });
  }

  return {
    valid: true,
    data: { message, history: normalizedHistory }
  };
}
