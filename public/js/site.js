const menuToggle = document.querySelector("#menuToggle");
const primaryNav = document.querySelector("#primaryNav");
const demoForm = document.querySelector("#demoSend");
const demoInput = document.querySelector("#demoInput");
const chatMessages = document.querySelector("#chatMessages");
const demoStatus = document.querySelector("#demoStatus");
const demoStatusText = document.querySelector("#demoStatusText");
const chatAvailability = document.querySelector("#chatAvailability");
const chatFootnote = document.querySelector("#chatFootnote");
const contactForm = document.querySelector("#contactForm");
const contactStatus = document.querySelector("#contactStatus");

let aiConnected = false;
let sending = false;
const demoHistory = [];

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Abrir navegação" : "Fechar navegação");
  menuToggle.innerHTML = `<svg><use href="${isOpen ? "#icon-menu" : "#icon-close"}"></use></svg>`;
  primaryNav.classList.toggle("is-open", !isOpen);
});

primaryNav.addEventListener("click", (event) => {
  if (!event.target.closest("a")) return;
  primaryNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir navegação");
  menuToggle.innerHTML = '<svg><use href="#icon-menu"></use></svg>';
});

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

function setDemoConnection(connected, message) {
  aiConnected = connected;
  demoInput.disabled = !connected;
  demoForm.disabled = !connected;
  demoInput.placeholder = connected ? "Escreva sua mensagem..." : "A API de IA não está conectada";
  chatAvailability.textContent = connected ? "Conectado à API" : "Exemplo visual";
  demoStatusText.textContent = message;
  chatFootnote.textContent = connected
    ? "As respostas são geradas pelo serviço de IA configurado no servidor."
    : "Interface demonstrativa. Mensagens desativadas enquanto a IA não estiver configurada.";
  demoStatus.classList.toggle("status-ready", connected);
  demoStatus.classList.remove("status-error");
}

async function checkAiConnection() {
  if (window.location.protocol === "file:") {
    setDemoConnection(false, "Demonstração visual · sem API conectada");
    return;
  }

  try {
    const response = await fetch("/api/health");
    if (!response.ok) throw new Error("Não foi possível verificar a conexão com a API.");
    const health = await response.json();
    setDemoConnection(
      health.aiConfigured === true,
      health.aiConfigured === true
        ? "API de IA conectada e pronta"
        : "Demonstração visual · configure a API de IA"
    );
  } catch {
    setDemoConnection(false, "Demonstração visual · API de IA indisponível");
  }
}

function addChatMessage(text, role) {
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${role === "user" ? "user-bubble" : "assistant-bubble"}`;
  bubble.textContent = text;
  chatMessages.append(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function setChatError(message) {
  chatFootnote.textContent = message;
  chatFootnote.classList.add("chat-error");
}

async function sendDemoMessage() {
  const message = demoInput.value.trim();
  if (!message || !aiConnected || sending) return;

  sending = true;
  demoForm.disabled = true;
  demoInput.disabled = true;
  demoInput.value = "";
  demoHistory.push({ role: "user", content: message });
  addChatMessage(message, "user");

  const typing = document.createElement("div");
  typing.className = "chat-typing";
  typing.setAttribute("role", "status");
  typing.setAttribute("aria-label", "Aguardando resposta da IA");
  typing.innerHTML = "<i></i><i></i><i></i>";
  chatMessages.append(typing);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history: demoHistory.slice(-20, -1) })
    });
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(result?.error?.message || "A IA não conseguiu responder. Tente novamente.");
    }
    if (typeof result?.reply !== "string" || !result.reply.trim()) {
      throw new Error("O serviço de IA retornou uma resposta inválida.");
    }

    demoHistory.push({ role: "assistant", content: result.reply.trim() });
    typing.remove();
    addChatMessage(result.reply.trim(), "assistant");
    chatFootnote.textContent = "As respostas são geradas pelo serviço de IA configurado no servidor.";
    chatFootnote.classList.remove("chat-error");
  } catch (error) {
    typing.remove();
    demoHistory.pop();
    setChatError(error.message || "Não foi possível conectar à API de IA.");
  } finally {
    sending = false;
    demoForm.disabled = !aiConnected;
    demoInput.disabled = !aiConnected;
    if (aiConnected) demoInput.focus();
  }
}

demoForm.addEventListener("click", sendDemoMessage);
demoInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    sendDemoMessage();
  }
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  contactStatus.textContent = "Envio não realizado: este formulário é demonstrativo e não há um canal de contato configurado. Este projeto foi desenvolvido para portfólio. Nenhum dado foi enviado.";
  contactStatus.classList.add("chat-error");
});

checkAiConnection();
