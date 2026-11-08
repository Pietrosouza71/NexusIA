const elements = {
  welcome: document.querySelector("#welcome"),
  messageList: document.querySelector("#messageList"),
  currentTitle: document.querySelector("#currentTitle"),
  connectionStatus: document.querySelector("#connectionStatus"),
  form: document.querySelector("#chatForm"),
  input: document.querySelector("#messageInput"),
  sendButton: document.querySelector("#sendButton"),
  characterCount: document.querySelector("#characterCount"),
  newChatButton: document.querySelector("#newChatButton"),
  endChatButton: document.querySelector("#endChatButton"),
  sidebar: document.querySelector("#sidebar"),
  sidebarScrim: document.querySelector("#sidebarScrim")
};

let conversations = [];
let activeConversationId = null;
let isSending = false;
let activeRequestController = null;

function activeConversation() {
  return conversations.find((conversation) => conversation.id === activeConversationId) || null;
}

function createConversation() {
  return {
    id: crypto.randomUUID(),
    title: "Novo atendimento",
    status: "open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: []
  };
}

function startNewChat() {
  if (activeRequestController) activeRequestController.abort();
  isSending = false;
  activeRequestController = null;
  conversations = [];
  activeConversationId = null;
  elements.input.disabled = false;
  elements.input.value = "";
  updateComposer();
  closeSidebar();
  renderConversation();
  elements.input.focus();
}

function renderConversation() {
  const conversation = activeConversation();
  elements.messageList.replaceChildren();
  elements.welcome.hidden = Boolean(conversation?.messages.length);
  elements.currentTitle.textContent = conversation?.title || "Novo atendimento";
  elements.endChatButton.disabled = !conversation || conversation.status === "closed";
  elements.input.disabled = conversation?.status === "closed";
  elements.input.placeholder = conversation?.status === "closed"
    ? "Atendimento encerrado. Inicie uma nova conversa."
    : "Escreva sua mensagem...";

  if (conversation) {
    conversation.messages.forEach((message) => renderMessage(message));
    if (conversation.status === "closed") renderClosedNotice();
  }
  updateComposer();
  scrollToBottom();
}

function renderProgrammingFaq() {
  const list = document.querySelector("#programmingFaq");
  if (!list) return;
  const questions = window.NexusFaq.getQuestions("programming");
  list.replaceChildren();

  questions.forEach((question) => {
    const button = document.createElement("button");
    button.className = "faq-question";
    button.type = "button";
    button.dataset.prompt = question;
    button.textContent = question;
    list.append(button);
  });
}

function renderItQuestions() {
  const list = document.querySelector("#itQuestions");
  const questions = window.NexusFaq.getQuestions("programming");
  list.replaceChildren();

  questions.forEach((question) => {
    const button = document.createElement("button");
    button.className = "history-item";
    button.type = "button";
    button.dataset.prompt = question;

    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("aria-hidden", "true");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#i-spark");
    icon.append(use);

    const label = document.createElement("span");
    label.className = "history-item-copy";
    const title = document.createElement("strong");
    title.textContent = question;
    label.append(title);
    button.append(icon, label);
    list.append(button);
  });
}

function renderMessage(message) {
  const row = document.createElement("article");
  row.className = `message-row ${message.role === "user" ? "user-message" : "assistant-message"}`;

  if (message.role === "assistant") {
    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    const mark = document.createElement("span");
    mark.className = "brand-mark";
    mark.innerHTML = "<span></span><span></span><span></span><span></span>";
    avatar.append(mark);
    row.append(avatar);
  }

  const content = document.createElement("div");
  content.className = "message-content";
  const author = document.createElement("div");
  author.className = "message-author";
  author.textContent = message.role === "user"
    ? "Você"
    : message.source === "faq" ? "Nexus Assistente · FAQ local" : "Nexus Assistente";
  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.textContent = message.content;
  const time = document.createElement("time");
  time.className = "message-time";
  time.dateTime = message.createdAt || new Date().toISOString();
  time.textContent = formatTime(message.createdAt);
  content.append(author, bubble, time);
  row.append(content);
  elements.messageList.append(row);
}

function renderTypingIndicator() {
  const row = document.createElement("div");
  row.className = "message-row assistant-message typing-row";
  row.id = "typingIndicator";
  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.innerHTML = '<span class="brand-mark"><span></span><span></span><span></span><span></span></span>';
  const bubble = document.createElement("div");
  bubble.className = "typing-bubble";
  bubble.setAttribute("role", "status");
  bubble.setAttribute("aria-label", "Nexus está digitando");
  bubble.innerHTML = "<i></i><i></i><i></i>";
  row.append(avatar, bubble);
  elements.messageList.append(row);
  scrollToBottom();
}

function renderClosedNotice() {
  const notice = document.createElement("div");
  notice.className = "closed-notice";
  notice.textContent = "Este atendimento foi encerrado. Inicie uma nova conversa para continuar.";
  elements.messageList.append(notice);
}

async function sendMessage(rawMessage) {
  const messageText = rawMessage.trim();
  if (!messageText || isSending || activeConversation()?.status === "closed") return;
  const useLocalFaq = window.location.protocol === "file:";

  let conversation = activeConversation();
  if (!conversation) {
    conversation = createConversation();
    activeConversationId = conversation.id;
    conversations.unshift(conversation);
  }

  const history = conversation.messages
    .filter((message) => message.role === "user" || message.role === "assistant")
    .slice(-19)
    .map(({ role, content }) => ({ role, content }));
  const userMessage = {
    id: crypto.randomUUID(),
    role: "user",
    content: messageText,
    createdAt: new Date().toISOString()
  };

  conversation.messages.push(userMessage);
  if (conversation.messages.filter((message) => message.role === "user").length === 1) {
    conversation.title = messageText.length > 34 ? `${messageText.slice(0, 34).trimEnd()}…` : messageText;
  }
  conversation.updatedAt = userMessage.createdAt;
  elements.input.value = "";
  isSending = true;
  activeRequestController = useLocalFaq ? null : new AbortController();
  renderConversation();
  renderTypingIndicator();
  try {
    let reply;
    let source = "ai";
    if (useLocalFaq) {
      await new Promise((resolve) => window.setTimeout(resolve, 450));
      reply = window.NexusFaq.getAnswer(messageText);
      source = "faq";
    } else {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText, history }),
        signal: activeRequestController.signal
      });
      const payload = await response.json().catch(() => null);
      if (payload?.error?.code === "AI_NOT_CONFIGURED") {
        reply = window.NexusFaq.getAnswer(messageText);
        source = "faq";
      } else {
        if (!response.ok) {
          throw new Error(payload?.error?.message || "Não foi possível obter uma resposta. Tente novamente.");
        }
        if (typeof payload?.reply !== "string" || !payload.reply.trim()) {
          throw new Error("Não foi possível preparar uma resposta. Tente novamente.");
        }
        reply = payload.reply.trim();
      }
    }

    if (activeConversationId !== conversation.id || conversation.status === "closed") return;
    conversation.messages.push({
      id: crypto.randomUUID(),
      role: "assistant",
      content: reply,
      createdAt: new Date().toISOString(),
      source
    });
    conversation.updatedAt = new Date().toISOString();
  } catch (error) {
    if (error.name !== "AbortError" && activeConversationId === conversation.id) {
      if (error instanceof TypeError) {
        conversation.messages.push({
          id: crypto.randomUUID(),
          role: "assistant",
          content: window.NexusFaq.getDisclosure(),
          createdAt: new Date().toISOString(),
          source: "faq"
        });
      } else {
        conversation.messages.push({
          id: crypto.randomUUID(),
          role: "error",
          content: error.message || "Não foi possível conectar ao atendimento. Tente novamente.",
          createdAt: new Date().toISOString(),
          isError: true
        });
      }
      conversation.updatedAt = new Date().toISOString();
    }
  } finally {
    if (activeConversationId === conversation.id) {
      isSending = false;
      activeRequestController = null;
      renderConversation();
      elements.input.focus();
    }
  }
}

function endConversation() {
  const conversation = activeConversation();
  if (!conversation || conversation.status === "closed") return;
  conversation.status = "closed";
  conversation.updatedAt = new Date().toISOString();
  if (activeRequestController) activeRequestController.abort();
  isSending = false;
  activeRequestController = null;
  renderConversation();
}

function updateComposer() {
  const hasText = elements.input.value.trim().length > 0;
  const closed = activeConversation()?.status === "closed";
  elements.sendButton.disabled = !hasText || isSending || closed;
  elements.characterCount.textContent = elements.input.value.length > 0
    ? `${elements.input.value.length}/4000`
    : "";
  elements.input.style.height = "auto";
  elements.input.style.height = `${Math.min(elements.input.scrollHeight, 160)}px`;
}

function formatTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function scrollToBottom() {
  requestAnimationFrame(() => {
    elements.messageList.scrollTop = elements.messageList.scrollHeight;
  });
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.textContent = message;
  document.body.append(toast);
  window.setTimeout(() => toast.remove(), 4200);
}

async function checkConnection() {
  if (window.location.protocol === "file:") {
    elements.connectionStatus.lastChild.textContent = " Orientação local disponível";
    elements.connectionStatus.classList.remove("status-offline");
    return;
  }

  try {
    const response = await fetch("/api/health");
    if (!response.ok) throw new Error("Health check failed");
    const health = await response.json();
    elements.connectionStatus.lastChild.textContent = health.aiConfigured
      ? " IA online"
      : " Orientação local disponível";
    elements.connectionStatus.classList.toggle("status-offline", !health.aiConfigured);
  } catch {
    elements.connectionStatus.lastChild.textContent = " Orientação local disponível";
    elements.connectionStatus.classList.remove("status-offline");
  }
}

function openSidebar() {
  elements.sidebar.classList.add("sidebar-open");
  elements.sidebarScrim.classList.add("scrim-visible");
}

function closeSidebar() {
  elements.sidebar.classList.remove("sidebar-open");
  elements.sidebarScrim.classList.remove("scrim-visible");
}

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(elements.input.value);
});
elements.input.addEventListener("input", updateComposer);
elements.input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    elements.form.requestSubmit();
  }
});
elements.newChatButton.addEventListener("click", startNewChat);
elements.endChatButton.addEventListener("click", endConversation);
document.querySelector("#openSidebar").addEventListener("click", openSidebar);
document.querySelector("#closeSidebar").addEventListener("click", closeSidebar);
elements.sidebarScrim.addEventListener("click", closeSidebar);
document.querySelector("#suggestions").addEventListener("click", (event) => {
  const button = event.target.closest("[data-prompt]");
  if (button) sendMessage(button.dataset.prompt);
});
document.querySelector("#itQuestions").addEventListener("click", (event) => {
  const button = event.target.closest("[data-prompt]");
  if (button) {
    closeSidebar();
    sendMessage(button.dataset.prompt);
  }
});
document.querySelector("#programmingFaqDetails").addEventListener("toggle", (event) => {
  elements.welcome.classList.toggle("faq-expanded", event.currentTarget.open);
});
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    startNewChat();
  }
});

renderItQuestions();
renderProgrammingFaq();
renderConversation();
checkConnection();
