<div align="center">
  <img src="assets/nexus-cover.svg" alt="Nexus — inteligência artificial, com intenção" width="100%">

  # Nexus

  **Inteligência artificial, com intenção.**

  Uma experiência digital conceitual que aproxima inteligência artificial, atendimento e design — com clareza, cuidado e transparência.

  <a href="https://pietrosouza71.github.io/NexusIA/"><strong>Acessar demonstração</strong></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/Pietrosouza71/NexusIA">Explorar o código</a>

  <br>

  <a href="https://github.com/Pietrosouza71/NexusIA/actions/workflows/pages.yml"><img src="https://github.com/Pietrosouza71/NexusIA/actions/workflows/pages.yml/badge.svg" alt="Status dos testes e publicação"></a>
  <img src="https://img.shields.io/badge/Node.js-18.18%2B-339933?logo=nodedotjs&logoColor=white" alt="Node.js 18.18 ou superior">
  <img src="https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white" alt="Express 4">
  <img src="https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?logo=javascript&logoColor=000" alt="JavaScript ES2022">
</div>

## Sobre

Nexus é um projeto de portfólio, não uma empresa ou serviço comercial. A interface apresenta o conceito de uma plataforma de IA e uma demonstração de atendimento em uma identidade visual escura, com detalhes em champagne.

A experiência combina uma landing page responsiva em HTML, CSS e JavaScript nativo com um servidor Node.js/Express. A API de conversa é compatível com provedores que implementam Chat Completions e só responde quando configurada no servidor — sem simular respostas quando a integração está indisponível.

## Destaques

- Layout responsivo, navegação por seções e menu adaptado para dispositivos móveis.
- Identidade visual original, ilustração orbital em CSS e animações com suporte a `prefers-reduced-motion`.
- FAQ educativo, separado da conversa com IA.
- Chat demonstrativo que verifica o estado da API e informa quando o serviço não está configurado.
- Backend com validação de entrada, limite de requisições e cabeçalhos de segurança via Helmet.
- Testes automatizados sem chamadas a serviços externos.

> **Sobre a demonstração:** o GitHub Pages publica somente a interface estática. O servidor Express não roda no Pages; por isso, o chat só fica disponível quando um backend é hospedado e configurado separadamente.

## Tecnologias

| Área | Ferramentas |
| --- | --- |
| Interface | HTML5, CSS3 e JavaScript nativo |
| Backend | Node.js 18.18+ e Express 4 |
| IA opcional | API compatível com OpenAI Chat Completions |
| Segurança | Helmet, `express-rate-limit` e validação de entrada |
| Testes | `node:test` |
| Publicação | GitHub Pages e GitHub Actions |

## Começar

**Requisitos:** Node.js 18.18 ou superior e npm.

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`. Para habilitar respostas de IA, copie `.env.example` para `.env` e configure as variáveis:

```dotenv
OPENAI_API_KEY=sua_chave
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1
PORT=3000
```

Sem uma chave de API, o servidor inicia normalmente, mas a conversa com IA permanece indisponível. **Nunca publique o arquivo `.env` ou chaves de API.**

Para abrir somente a versão estática, use `public/index.html`; nesse modo, o chat fica desativado.

## Testes

```bash
npm test
```

Os testes também são executados automaticamente antes de cada publicação. Se algum teste falhar, o deploy não continua.

## Publicação

Cada atualização na branch `main` executa os testes e, se estiverem aprovados, publica `public/` no [GitHub Pages](https://pietrosouza71.github.io/NexusIA/). O mesmo fluxo pode ser iniciado manualmente pela aba **Actions** do repositório.

## Estrutura

```text
.
├── .github/workflows/pages.yml  # Testes e publicação
├── assets/nexus-cover.svg       # Capa deste README
├── public/                      # Site estático publicado
├── src/                         # Servidor, rotas e integração de IA
├── test/                        # Testes automatizados
├── .env.example                 # Exemplo de configuração local
└── package.json
```

## Desenvolvedor

**Pietro Souza** · [GitHub @Pietrosouza71](https://github.com/Pietrosouza71)

## Licença

Este repositório não inclui uma licença. A publicação pública no GitHub não concede, por si só, permissão para reutilizar o código ou os recursos.
