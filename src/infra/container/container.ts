import { Container } from "inversify";
import { GitHubService } from "../../application/github/services/github.services.js";
import { OpenAIService } from "../../application/openai/services/openAi.service.js";
import { WebhookController } from "../controllers/webhook/webhook.controller.js";

const container = new Container();

container.bind<GitHubService>(GitHubService).toSelf();
container.bind<OpenAIService>(OpenAIService).toSelf();

container.bind<WebhookController>(WebhookController).toSelf();

export { container };
