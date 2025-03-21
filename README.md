# Review AI Backend

Projeto construído com Node e TypeScript, com o objetivo de realizar code reviews utilizando IA através de webhooks do Git.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript server-side.
- **TypeScript**: Superset de JavaScript que adiciona tipagem estática ao código.
- **Ngrok**: Ferramenta para criar túneis seguros para o localhost.
- **Docker**: Plataforma para desenvolvimento e execução de aplicações em contêineres.

## Funcionalidades

- Integração com webhooks do Git para receber eventos de repositórios.
- Análise de código utilizando inteligência artificial para fornecer feedback sobre pull requests (foi utlizado a openAi, mas facilmente adaptavel a outros modelos, como llamaAI que roda locamente).
- Geração de relatórios de revisão de código.
- Gerenciamento de filas para processamento de eventos.

## Pré-requisitos

- Node.js (versão 14 ou superior)
- Docker
- Ngrok

## Como Executar

### 1. Clone o repositório

```bash
git clone https://github.com/11jl98/review-ai-backend.git
cd review-ai-backend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis de ambiente conforme necessário.

### 4. Inicie o Docker

Certifique-se de que o Docker está instalado e em execução. Inicie os contêineres necessários:

```bash
docker-compose up -d
```

### 5. Inicie o Ngrok

Para permitir que o GitHub envie webhooks para o seu servidor local, você precisará usar o Ngrok para criar um túnel seguro para o localhost:

```bash
ngrok http 3000
```

Ngrok fornecerá uma URL pública que você pode usar para configurar o webhook no GitHub. Copie a URL fornecida pelo Ngrok.

### 6. Configure o Webhook no GitHub

1. Vá até o repositório no GitHub onde deseja configurar o webhook.
2. Vá para **Settings > Webhooks > Add webhook**.
3. No campo "Payload URL", cole a URL pública fornecida pelo Ngrok seguida de `/webhook`. Por exemplo: `https://abc123.ngrok.io/webhook`.
4. Selecione o tipo de conteúdo `application/json`.
5. Marque os eventos que deseja receber (por exemplo, `Pull requests`).
6. Clique em **Add webhook**.

### 7. Inicie o servidor

```bash
npm start
```

O servidor estará em execução e pronto para receber eventos de webhook do GitHub.

## Como Contribuir

1. Faça um fork do projeto.
2. Crie uma nova branch com a sua feature: `git checkout -b minha-feature`
3. Commit suas mudanças: `git commit -m 'Minha nova feature'`
4. Envie para o repositório remoto: `git push origin minha-feature`
5. Abra um Pull Request.

## Contato

Caso tenha alguma dúvida ou sugestão, sinta-se à vontade para entrar em contato.

---

Projeto desenvolvido por [João Luiz](https://github.com/11jl98).
