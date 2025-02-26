import { ContainerModule, type interfaces } from "inversify";

import { TYPES } from "../../types.js";
import { Queue } from "../../../queue/queue.js";
import { QueueConsumer } from "../../../queue/queue.consumer.js";
import { Logger } from "../../../logger/logger.js";

export const infraContainer = new ContainerModule((bind: interfaces.Bind) => {
  bind(TYPES.Queue).to(Queue).inSingletonScope();
  bind(QueueConsumer).toSelf();
  bind(TYPES.logger).to(Logger).inSingletonScope();
});
