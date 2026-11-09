<div align="center">
  <img src="assets/nexus-cover.svg" alt="Nexus — inteligência artificial, com intenção" width="100%">

  # Nexus
  **Inteligência artificial, com intenção.**

  Uma experiência web conceitual que explora como IA, atendimento e design podem se aproximar de forma clara e responsável.

  <a href="https://pietrosouza71.github.io/nexus-ai-portfolio/">Ver demonstração</a>
  ·
  <a href="https://github.com/Pietrosouza71/nexus-ai-portfolio">Código-fonte</a>

  ![Node.js](https://img.shields.io/badge/Node.js-18.18%2B-339933?logo=nodedotjs&logoColor=white)
  ![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)
  ![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?logo=javascript&logoColor=000)
  ![License](https://img.shields.io/badge/licen%C3%A7a-sem%20licen%C3%A7a-lightgrey)
</div>

## Sobre o projeto

Nexus é um projeto de portfólio — não é uma empresa nem um serviço comercial real. A landing page apresenta o conceito de uma plataforma de inteligência artificial e uma interface de atendimento demonstrativa, em uma identidade visual escura com detalhes champagne.

O projeto combina uma interface responsiva em HTML, CSS e JavaScript nativo com um servidor Node.js/Express. O servidor inclui uma rota de conversa preparada para provedores compatíveis com a API de Chat Completions da OpenAI. A integração só responde quando uma chave é configurada no ambiente do servidor; a página nunca inventa respostas de IA quando a integração está indisponível.

## Funcionalidades

- Landing page responsiva com navegação por seções, menu móvel e formulário de contato demonstrativo.
- Identidade visual original com ilustração orbital em CSS, animações suaves e suporte a `prefers-reduced-motion`.
- Perguntas frequentes com respostas educativas predefinidas, separadas da conversa com IA.
- Demonstração de chat que consulta o estado da API e deixa o envio desabilitado quando não configurada.
- Backend Express com validação de entrada, limite de requisições e cabeçalhos de segurança via Helmet.
- Serviço compatível com APIs de Chat Completions, com segredo mantido no servidor e respostas de erro controladas.
- Testes automatizados para validação e integração do serviço de IA, sem chamadas externas.

> **Limite da publicação:** o GitHub Pages hospeda somente os arquivos estáticos em `public/`. Ele não executa o servidor Express. Portanto, na demonstração pública a interface de chat permanece desativada até que o backend seja hospedado separadamente e configurado.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Interface | HTML5, CSS3 e JavaScript nativo |
| Servidor | Node.js 18.18+ e Express 4 |
| Integração opcional | API compatível com OpenAI Chat Completions |
| Segurança | Helmet, `express-rate-limit` e validação de entrada |
| Testes | `node:test` |

## Executar localmente

**Requisitos:** Node.js 18.18 ou superior e npm.

```bash
npm install
```

Para executar apenas a versão estática, abra `public/index.html` no navegador. A demonstração de chat ficará desativada.

Para iniciar a aplicação completa com o servidor:

1. Copie `.env.example` para `.env` (no PowerShell: `Copy-Item .env.example .env`).
2. Se desejar habilitar respostas de IA, configure a chave válida no arquivo `.env` local:

   ```dotenv
   OPENAI_API_KEY=sua_chave
   OPENAI_MODEL=gpt-4o-mini
   OPENAI_BASE_URL=https://api.openai.com/v1
   PORT=3000
   ```

3. Inicie o servidor e abra `http://localhost:3000`:

   ```bash
   npm run dev
   ```

**Nunca** compartilhe ou publique `.env` ou chaves de API. O arquivo está ignorado pelo Git; `.env.example` contém apenas nomes e valores de exemplo.

## Testes

```bash
npm test
```

## Publicação

A versão estática será publicada no [GitHub Pages](https://pietrosouza71.github.io/NexusIA/) após a execução bem-sucedida do workflow e a ativação do Pages no repositório. O workflow publica a pasta `public/` quando há alterações na branch `main`. O backend não faz parte dessa publicação; para habilitar o chat, implante `src/server.js` em um serviço Node.js e configure os segredos nesse serviço.

## Estrutura do projeto

```text
NexusIA/
├── .github/workflows/pages.yml  # Publicação do site no GitHub Pages
├── assets/nexus-cover.svg       # Capa do README
├── public/
│   ├── assets/nexus-mark.svg    # Ícone da marca
│   ├── css/
│   │   ├── premium.css          # Estilos da landing page atual
│   │   └── style.css            # Estilos do protótipo anterior, não carregados
│   ├── js/
│   │   ├── site.js              # Interações da landing page atual
│   │   ├── faq.js               # FAQ do protótipo anterior, não carregado
│   │   └── script.js            # Script do protótipo anterior, não carregado
│   └── index.html
├── src/
│   ├── config/knowledgeBase.js
│   ├── routes/chatRoutes.js
│   ├── services/aiService.js
│   ├── utils/validation.js
│   └── server.js
├── test/chat.test.js
├── .env.example
├── .gitignore
└── package.json
```

Os arquivos do protótipo anterior foram mantidos para não remover conteúdo existente; a landing page atual carrega `premium.css` e `site.js`.

## Desenvolvedor

**Pietro Souza** · [GitHub @Pietrosouza71](https://github.com/Pietrosouza71)

## Licença

Este repositório não inclui uma licença. Todos os direitos são reservados; a publicação pública no GitHub não concede, por si só, permissão para reutilizar o código ou os recursos.
