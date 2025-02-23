import { ContainerModule, type interfaces } from "inversify";

import { TYPES } from "../../types.js";
import { Queue } from "../../../queue/queue.js";
import { QueueConsumer } from "src/infra/queue/queue.consumer.js";

export const infraContainer = new ContainerModule((bind: interfaces.Bind) => {
  bind(TYPES.Queue).to(Queue).inSingletonScope();
  bind(QueueConsumer).toSelf();
});
