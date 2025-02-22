import { Container } from "inversify";
import { githubContainer } from "./modules/github/github.container.js";
import { opneAIContainer } from "./modules/openai/openai.container.js";

export const container = new Container();
container.load(githubContainer, opneAIContainer);
