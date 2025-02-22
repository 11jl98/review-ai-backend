import { Container } from "inversify";
import { GitHubService } from "../../../application/github/services/github.services";
import { OpenAIService } from "../../../application/openai/services/openai.service";
import { WebhookController } from "../../controllers/webhook/webhook.controller";
import { TYPES } from "../types";
const container = new Container();

container.bind<GitHubService>(TYPES.Services.GitHubService).toSelf();
container.bind<OpenAIService>(TYPES.Services.OpenAIService).toSelf();

container.bind<WebhookController>(TYPES.Controllers.webHooks).toSelf();

export { container };
