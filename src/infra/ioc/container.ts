import { Container } from "inversify";
import { githubContainer } from "./modules/github/github.container.js";
import { aiContainer } from "./modules/ai/ai.container.js";
import { infraContainer } from "./modules/infra/infra.container.js";
import { cacheContainer } from "./modules/cache/cache.container.js";

export const container = new Container();
container.load(githubContainer, aiContainer, infraContainer, cacheContainer);
