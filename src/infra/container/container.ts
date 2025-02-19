import { Container } from "inversify";
import { GitHubService } from "../../application/github/services/github.services";
import { OpenAIService } from "../../application/openAi/services/openAi.service";
import { WebhookController } from "../controllers/webhook/webhook.controller";

const container = new Container();

container.bind<GitHubService>(GitHubService).toSelf();
container.bind<OpenAIService>(OpenAIService).toSelf();

container.bind<WebhookController>(WebhookController).toSelf();

export { container };
