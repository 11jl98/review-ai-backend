import { Request, Response } from "express";
import { controller, httpPost, requestBody } from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "../../ioc/types.js";
import { Queue } from "../../queue/queue.js";
import { EVENTS } from "../../queue/events.js";
import { Logger } from "../../logger/logger.js";

@controller("/webhook")
export class WebhookController {
  constructor(
    @inject(TYPES.Queue) private queue: Queue,
    @inject(TYPES.logger) private logger: Logger
  ) {}

  @httpPost("/")
  public async handle(req: Request, res: Response) {
    const { action, pull_request, repository } = req.body;
    const { correlation_id } = req;

    this.logger.info(
      `[${WebhookController.name}] - requisição feita - correlationId: ${correlation_id}`
    );

    if (
      action !== "opened" &&
      action !== "synchronize" &&
      action !== "reopened"
    ) {
      this.logger.info(
        `[${WebhookController.name}] - evento ignorado: ${correlation_id} `
      );
      return res.status(200).send("Ignoring event");
    }

    try {
      const eventData = {
        owner: repository.owner.login,
        repo: repository.name,
        pullNumber: pull_request.number,
      };

      await this.queue.publish(EVENTS.RECEIVE_PR, eventData);

      this.logger.info(
        `[${WebhookController.name}] 📤 PR #${pull_request.number} enviado para a fila! - correlationId: ${correlation_id}`
      );
      res.status(200).send("✅ PR adicionado à fila.");
    } catch (error) {
      this.logger.error(
        `Erro em processar PR: ${error} - correlationId: ${correlation_id}`
      );
      res.status(500).send("Internal Server Error");
    }
  }
}
