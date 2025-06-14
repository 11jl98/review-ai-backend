import { inject, injectable } from "inversify";
import { AiServiceInterface } from "./interfaces/ai.service.interface.js";
import { TYPES } from "../../../infra/ioc/types.js";
import { LoggerInterface } from "src/infra/logger/interfaces/logger.interface.js";
import { AiProviderInterface } from "../providers/interfaces/ai.provider.interface.js";
import { CacheService } from "../../cache/services/cache.service.js";
import { CacheServiceInterface } from "src/application/cache/services/interfaces/cache.service.interface.js";

@injectable()
export class AiService implements AiServiceInterface {
  constructor(
    @inject(TYPES.Logger) private logger: LoggerInterface,
    @inject(TYPES.Providers.Ollama) private aiProvider: AiProviderInterface,
    @inject(TYPES.Services.CacheService)
    private cacheService: CacheServiceInterface
  ) {}
  async processFileToReview(code: string): Promise<string> {
    try {
      const cachedReview = await this.cacheService.findSimilarReview([code]);
      if (cachedReview) {
        this.logger.info(
          `[${AiService.name}] Cache hit! Usando review cacheada`
        );
        return cachedReview;
      }

      this.logger.info(`[${AiService.name}] Cache miss. Processando com IA`);
      this.logger.info(
        `[${AiService.name}] Processando arquivo e enviando para AI `
      );
      const response = await this.aiProvider.generate(code);

      await this.cacheService.cacheReview([code], response);
      this.logger.info(`[${AiService.name}] Review cacheada com sucesso`);

      return response;
    } catch (error: any) {
      this.logger.error(
        `❌ [${AiService.name}] Erro ao chamar OpenAI: ${error}`
      );
      return `Não foi possível processar o PR`;
    }
  }
}
