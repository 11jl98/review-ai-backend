import { ContainerModule, type interfaces } from "inversify";

import { TYPES } from "../../types.js";
import { OpenAIService } from "../../../../application/openai/services/openai.service.js";

export const opneAIContainer = new ContainerModule((bind: interfaces.Bind) => {
  bind(TYPES.Services.OpenAIService).to(OpenAIService);
});
