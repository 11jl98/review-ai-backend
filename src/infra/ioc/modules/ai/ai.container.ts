import { ContainerModule, type interfaces } from "inversify";

import { TYPES } from "../../types.js";
import { AiService } from "../../../../application/ai/services/ai.service.js";
import { OllamaProvider } from "src/application/ai/providers/ollama.provider.js";
import { OpenAiProvider } from "src/application/ai/providers/openAi.provider.js";

export const aiContainer = new ContainerModule((bind: interfaces.Bind) => {
  bind(TYPES.Services.aiService).to(AiService);
  bind(TYPES.Providers.Ollama).to(OllamaProvider);
  bind(TYPES.Providers.OpenAi).to(OpenAiProvider);
});
