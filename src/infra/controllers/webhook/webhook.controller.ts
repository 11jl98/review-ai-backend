import { Request, Response } from "express";
import { controller, httpPost, requestBody } from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "src/infra/ioc/types.js";
import { Queue } from "src/infra/queue/queue.js";
import { EVENTS } from "src/infra/queue/events.js";

@controller("/webhook")
export class WebhookController {
  constructor(@inject(TYPES.Queue) private queue: Queue) {}

  @httpPost("/")
  public async handle(req: Request, res: Response) {
    const { action, pull_request, repository } = req.body;

    if (
      action !== "opened" &&
      action !== "synchronize" &&
      action !== "reopened"
    ) {
      return res.status(200).send("Ignoring event");
    }

    try {
      const eventData = {
        owner: repository.owner.login,
        repo: repository.name,
        pullNumber: pull_request.number,
      };

      await this.queue.publish(EVENTS.RECEIVE_PR, eventData);

      console.log(`📤 PR #${pull_request.number} enviado para a fila!`);
      res.status(200).send("✅ PR adicionado à fila.");

      res.status(200).send("Review added");
    } catch (error) {
      console.error("Error processing PR:", error);
      res.status(500).send("Internal Server Error");
    }
  }
}
