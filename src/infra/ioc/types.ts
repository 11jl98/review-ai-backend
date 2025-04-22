export const TYPES = {
  Controllers: {
    webHooks: Symbol.for("WebhookController"),
  },
  Services: {
    GitHubService: Symbol.for("GitHubService"),
    aiService: Symbol.for("OpenAIService"),
  },
  Providers: {
    Ollama: Symbol.for("OllamaProvider"),
    OpenAi: Symbol.for("OpenAiProvider"),
  },
  middlewares: {
    correlation: Symbol.for("CorrelationIdMiddleware"),
  },
  Queue: Symbol.for("Queue"),
  QueueConsumer: Symbol.for("QueueConsumer"),
  logger: Symbol.for("Logger"),
} as const;
