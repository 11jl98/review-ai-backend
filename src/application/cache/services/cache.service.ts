import { inject, injectable } from "inversify";
import { TYPES } from "../../../infra/ioc/types.js";
import { Neo4jProvider } from "../../../infra/database/neo4j.provider.js";
import { Logger } from "../../../infra/logger/logger.js";
import { createHash } from "crypto";
import { CacheServiceInterface } from "./interfaces/cache.service.interface.js";

@injectable()
export class CacheService implements CacheServiceInterface {
  constructor(
    @inject(TYPES.Neo4jProvider) private neo4j: Neo4jProvider,
    @inject(TYPES.Logger) private logger: Logger
  ) {}

  private generateHash(files: string[]): string {
    const content = files.sort().join("");
    return createHash("sha256").update(content).digest("hex");
  }

  public async cacheReview(files: string[], review: string): Promise<void> {
    const session = await this.neo4j.getSession();
    try {
      const hash = this.generateHash(files);
      this.logger.info(
        `[CacheService] Cacheando review para ${files.length} arquivos`
      );

      await session.run(
        `
        CREATE (r:Review {hash: $hash, content: $review, timestamp: datetime()})
        WITH r
        UNWIND $files as fileName
        MERGE (f:File {name: fileName})
        CREATE (f)-[:PART_OF]->(r)
        `,
        { hash, review, files }
      );
    } catch (error) {
      this.logger.error(`[CacheService] Erro ao cachear review: ${error}`);
      throw error;
    } finally {
      await session.close();
    }
  }

  public async findSimilarReview(files: string[]): Promise<string | null> {
    const session = await this.neo4j.getSession();
    try {
      this.logger.info(
        `[CacheService] Buscando reviews similares para ${files.length} arquivos`
      );

      const result = await session.run(
        `
        MATCH (f:File)-[:PART_OF]->(r:Review)
        WHERE f.name IN $files
        WITH r, COUNT(DISTINCT f) as commonFiles
        WHERE commonFiles >= $threshold
        RETURN r.content as review
        ORDER BY commonFiles DESC, r.timestamp DESC
        LIMIT 1
        `,
        {
          files,
          threshold: Math.ceil(files.length * 0.9),
        }
      );

      if (result.records.length > 0) {
        this.logger.info(`[CacheService] Review em cache encontrada`);
        return result.records[0].get("review");
      }

      this.logger.info(`[CacheService] Nenhuma review similar encontrada`);
      return null;
    } catch (error) {
      this.logger.error(
        `[CacheService] Erro ao buscar reviews similares: ${error}`
      );
      throw error;
    } finally {
      await session.close();
    }
  }
}
