import { Container } from "inversify";
import { githubContainer } from "./modules/github/github.container.js";
import { openAIContainer } from "./modules/openai/openai.container.js";
import { infraContainer } from "./modules/infra/infra.container.js";

export const container = new Container();
container.load(githubContainer, openAIContainer, infraContainer);
