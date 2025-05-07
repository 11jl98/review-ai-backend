import { ContainerModule, type interfaces } from "inversify";

import { TYPES } from "../../types.js";
import { WebhookController } from "../../../controllers/webhook/webhook.controller.js";
import { GitHubService } from "../../../../application/github/services/github.services.js";

export const githubContainer = new ContainerModule((bind: interfaces.Bind) => {
  bind(TYPES.Controllers.WebHooks).to(WebhookController);
  bind(TYPES.Services.GitHubService).to(GitHubService);
});
