(function () {
  const normalize = (value) => value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const topics = [
    {
      category: "programming",
      keywords: ["diferenca entre python", "python, java e javascript", "python java javascript"],
      question: "Qual é a diferença entre Python, Java e JavaScript?",
      answer: "Python tem sintaxe concisa e é muito usado em automação, análise de dados e inteligência artificial. Java é uma linguagem compilada para bytecode, comum em sistemas corporativos e aplicações Android. JavaScript é essencial para interatividade na web e também pode ser usado no servidor com Node.js. Apesar dos nomes parecidos, Java e JavaScript são linguagens diferentes."
    },
    {
      category: "programming",
      keywords: ["o que e uma api", "o que sao apis", "como funciona uma api", "como as api"],
      question: "O que é uma API e como ela funciona?",
      answer: "API é uma interface que permite que programas diferentes se comuniquem. Por exemplo, um site pode enviar uma solicitação a uma API, que processa o pedido e devolve dados em um formato combinado, como JSON. A API define quais operações estão disponíveis e como solicitá-las."
    },
    {
      category: "programming",
      keywords: ["logica de programacao", "logica para programar", "como programar"],
      question: "Como funciona a lógica de programação?",
      answer: "Lógica de programação é organizar instruções para resolver um problema passo a passo. Você identifica os dados de entrada, define regras e decisões, e determina o resultado. Por exemplo: receber duas notas, calcular a média e verificar se ela atingiu o valor mínimo para aprovação."
    },
    {
      category: "programming",
      keywords: ["estruturas condicionais e loops", "condicionais e loops", "o que sao loops", "o que sao condicionais", "lacos de repeticao", "if e for"],
      question: "O que são estruturas condicionais e loops?",
      answer: "Condicionais permitem escolher quais instruções executar: por exemplo, `if` verifica uma condição e executa um caminho ou outro. Loops, também chamados de laços de repetição, repetem instruções enquanto uma condição for válida ou para cada item de uma lista. Ambos ajudam a controlar o fluxo do programa."
    },
    {
      category: "programming",
      keywords: ["diferenca entre front end e back end", "front end e back end", "frontend backend", "front-end back-end"],
      question: "Qual é a diferença entre Front-end e Back-end?",
      answer: "Front-end é a parte da aplicação com a qual a pessoa interage: tela, botões e estilos, normalmente feitos com HTML, CSS e JavaScript. Back-end funciona no servidor e cuida de regras de negócio, processamento e acesso a dados. O front-end pode conversar com o back-end por meio de APIs."
    },
    {
      category: "programming",
      keywords: ["o que e um framework", "o que sao frameworks", "para que serve um framework"],
      question: "O que é um framework?",
      answer: "Framework é uma estrutura com ferramentas, padrões e componentes reutilizáveis que ajudam a desenvolver um tipo de aplicação. Ele oferece uma base organizada para tarefas comuns. Por exemplo, Express é um framework para criar servidores web com Node.js."
    },
    {
      category: "programming",
      keywords: ["desenvolvimento de um sistema web", "desenvolver um sistema web", "como criar um site", "como funciona desenvolvimento web"],
      question: "Como funciona o desenvolvimento de um sistema web?",
      answer: "O desenvolvimento costuma começar com os requisitos e o planejamento da experiência. Depois são criados o front-end e o back-end, definidos os dados e as integrações. Em seguida, a equipe testa os fluxos e a segurança, publica o sistema em um servidor e acompanha sua manutenção e melhorias."
    },
    {
      keywords: ["o que e o nexus", "quem e a nexus", "o que e essa empresa", "sobre o nexus", "sobre a nexus"],
      question: "O que é o Nexus?",
      answer: "O Nexus é um projeto fictício de atendimento, desenvolvido exclusivamente para demonstração e composição de portfólio."
    },
    {
      keywords: ["ia configurada", "ia funciona", "inteligencia artificial", "ia generativa", "bot inteligente"],
      question: "A inteligência artificial está funcionando?",
      answer: getDisclosure()
    },
    {
      keywords: ["historico", "salva conversa", "salvam conversa", "onde ficam minhas mensagens"],
      question: "Como funciona o histórico?",
      answer: "As conversas ficam disponíveis apenas enquanto esta página está aberta. Ao recarregar ou fechar a página, elas não são salvas."
    },
    {
      keywords: ["atendente", "atendimento humano", "pessoa", "falar com alguem", "telefone", "contato", "whatsapp"],
      question: "Posso falar com um atendente?",
      answer: "Esta demonstração não está conectada a uma equipe humana, então não consigo transferir a conversa nem abrir um chamado."
    },
    {
      keywords: ["senha", "codigo de acesso", "codigo de verificacao", "autenticacao", "invadiram", "hackearam"],
      question: "Posso enviar minha senha ou código?",
      answer: "Não. Nunca compartilhe senhas, códigos de autenticação ou dados bancários no chat."
    },
    {
      keywords: ["preco", "precos", "valor", "valores", "custa", "custo", "pagamento", "pagar", "pix", "boleto", "cartao", "reembolso", "estorno", "cobranca"],
      question: "Quanto custam os serviços?",
      answer: "Como o Nexus é um projeto fictício de portfólio, não existem preços, cobranças ou políticas de pagamento definidos."
    },
    {
      keywords: ["horario", "horarios", "funcionamento", "prazo", "entrega", "garantia", "cancelamento", "endereco"],
      question: "Quais são os horários e prazos?",
      answer: "O projeto de portfólio não define horários de atendimento, prazos, garantias ou endereço."
    },
    {
      keywords: ["servico", "servicos", "produto", "produtos", "catalogo", "plano", "planos", "oferecem", "oferece"],
      question: "Quais serviços a Nexus oferece?",
      answer: "Não há catálogo de produtos ou serviços reais. A interface demonstra como uma plataforma de suporte poderia funcionar."
    },
    {
      keywords: ["problema", "erro", "nao funciona", "nao consigo", "travou", "travando", "tecnico", "suporte", "falha", "conexao", "internet", "aplicativo", "computador", "celular"],
      question: "O que faço se algo não funcionar?",
      answer: "Se for seguro, verifique sua conexão e tente fechar e reabrir o aplicativo ou dispositivo. Se o problema continuar, consulte o suporte oficial do produto. Não envie senhas, códigos ou dados bancários."
    },
    {
      keywords: ["privacidade", "meus dados", "dados pessoais", "seguro", "seguranca", "compartilhados"],
      question: "Como meus dados são armazenados?",
      answer: "As conversas desta demonstração ficam apenas na memória da página e não são salvas. Não insira informações pessoais, senhas, códigos ou dados bancários."
    },
    {
      keywords: ["ola", "oi", "bom dia", "boa tarde", "boa noite", "tudo bem"],
      question: "Como posso começar?",
      answer: "Envie uma pergunta ou selecione uma das perguntas frequentes. Este site é uma demonstração de portfólio e não está conectado a serviços ou atendentes reais."
    }
  ];

  function getDisclosure() {
    return "Este projeto é fictício e foi desenvolvido exclusivamente para fins de demonstração e composição de portfólio. A inteligência artificial ainda não possui integração ou configuração funcional, sendo apresentada apenas como uma proposta conceitual.";
  }

  function getAnswer(message) {
    const text = normalize(message);
    const topic = topics.find((item) =>
      item.keywords.some((keyword) => text.includes(normalize(keyword)))
    );

    return topic?.answer ||
      getDisclosure();
  }

  function getQuestions(category) {
    return topics
      .filter((topic) => !category || topic.category === category)
      .map(({ question }) => question);
  }

  window.NexusFaq = Object.freeze({ getAnswer, getDisclosure, getQuestions });
})();
