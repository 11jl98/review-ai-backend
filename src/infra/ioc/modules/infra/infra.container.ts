import { ContainerModule, type interfaces } from "inversify";

import { TYPES } from "../../types.js";
import { Queue } from "../../../queue/queue.js";
import { QueueController } from "src/infra/controllers/queue.controller.js";

export const infraContainer = new ContainerModule((bind: interfaces.Bind) => {
  bind(TYPES.Queue).to(Queue);
  bind(TYPES.Controllers.Queue).to(QueueController);
});
