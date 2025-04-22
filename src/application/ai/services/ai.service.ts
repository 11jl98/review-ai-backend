import { inject, injectable } from "inversify";
import { AiServiceInterface } from "./interfaces/ai.service.interface.js";
import { TYPES } from "../../../infra/ioc/types.js";
import { LoggerInterface } from "src/infra/logger/interfaces/logger.interface.js";
import { AiProviderInterface } from "../providers/interfaces/ai.provider.interface.js";

@injectable()
export class AiService implements AiServiceInterface {
  constructor(
    @inject(TYPES.logger) private logger: LoggerInterface,
    @inject(TYPES.Providers.Ollama) private aiProvider: AiProviderInterface
  ) {}

  async processFileToReview(code: string): Promise<string> {
    try {
      this.logger.info(`Processando arquivo e enviando para AI `);
      const response = await this.aiProvider.generate(code);

      return response;
    } catch (error: any) {
      this.logger.error(`❌ Erro ao chamar OpenAI: ${error}`);
      return `Não foi possível processar o PR`;
    }
  }
}
