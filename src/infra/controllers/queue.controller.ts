import { inject, injectable } from "inversify";
import { QUEUES } from "../queue/queues-list.js";
import { TYPES } from "../ioc/types.js";
import { Queue } from "../queue/queue.js";

@injectable()
export class QueueController {
  constructor(
    @inject(TYPES.Queue)
    private readonly queue: Queue
  ) {}

  public async init() {
    this.queue.consume(
      QUEUES.REVIEW_PR,
      async (message: string): Promise<void> => {
        console.log("QUEUE [REVIEW_PR]");
        console.log(message);
      }
    );

    this.queue.consume(QUEUES.LOG, async (event: any): Promise<void> => {
      console.log("QUEUE [LOG]");
      console.log(event);
    });
  }
}
