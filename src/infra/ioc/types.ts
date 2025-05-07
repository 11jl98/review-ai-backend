export const TYPES = {
  Controllers: {
    WebHooks: Symbol.for("WebhookController"),
  },
  Services: {
    GitHubService: Symbol.for("GitHubService"),
    AiService: Symbol.for("OpenAIService"),
  },
  Providers: {
    Ollama: Symbol.for("OllamaProvider"),
    OpenAi: Symbol.for("OpenAiProvider"),
  },
  Middlewares: {
    ValidateEventsMiddleware: Symbol.for("ValidateEventsMiddleware"),
    VerifySignatureMiddleware: Symbol.for("VerifySignatureMiddleware")
  },
  Queue: Symbol.for("Queue"),
  QueueConsumer: Symbol.for("QueueConsumer"),
  Logger: Symbol.for("Logger"),
} as const;
