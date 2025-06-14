export const TYPES = {
  Controllers: {
    WebHooks: Symbol.for("WebhookController"),
  },
  Services: {
    GitHubService: Symbol.for("GitHubService"),
    AiService: Symbol.for("OpenAIService"),
    CacheService: Symbol.for("CacheService"),
  },
  Providers: {
    Ollama: Symbol.for("OllamaProvider"),
    OpenAi: Symbol.for("OpenAiProvider"),
    Neo4j: Symbol.for("Neo4jProvider"),
  },
  Middlewares: {
    ValidateEventsMiddleware: Symbol.for("ValidateEventsMiddleware"),
    VerifySignatureMiddleware: Symbol.for("VerifySignatureMiddleware")
  },
  Queue: Symbol.for("Queue"),
  QueueConsumer: Symbol.for("QueueConsumer"),  Logger: Symbol.for("Logger"),
  Neo4jProvider: Symbol.for("Neo4jProvider"),
} as const;
