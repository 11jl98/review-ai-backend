import { ContainerModule } from "inversify";
import { TYPES } from "../../types.js";
import { CacheService } from "../../../../application/cache/services/cache.service.js";
import { Neo4jProvider } from "../../../database/neo4j.provider.js";

export const cacheContainer = new ContainerModule((bind) => {
  bind(TYPES.Neo4jProvider).to(Neo4jProvider).inSingletonScope();
  bind(TYPES.Services.CacheService).to(CacheService).inSingletonScope();
});
