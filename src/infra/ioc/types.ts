import { Queue } from "../queue/queue.js";

export const TYPES = {
  Controllers: {
    webHooks: Symbol.for("WebhookController"),
  },
  Services: {
    GitHubService: Symbol.for("GitHubService"),
    OpenAIService: Symbol.for("OpenAIService"),
  },
  Queue: Symbol.for("Queue"),
  QueueConsumer: Symbol.for("QueueConsumer"),
};
