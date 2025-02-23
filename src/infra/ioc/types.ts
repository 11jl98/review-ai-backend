export const TYPES = {
  Controllers: {
    webHooks: Symbol.for("WebhookController"),
    Queue: Symbol.for("QueueController"),
  },
  Services: {
    GitHubService: Symbol.for("GitHubService"),
    OpenAIService: Symbol.for("OpenAIService"),
  },
  Queue: Symbol.for("Queue"),
};
