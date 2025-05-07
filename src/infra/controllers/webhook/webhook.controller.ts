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
    @inject(TYPES.Logger) private logger: Logger
  ) {}

  @httpPost("/")
  public async handle(req: Request, res: Response) {
    try {
      const { pull_request, repository } = req.body;

      this.logger.info(`[${WebhookController.name}] - requisição feita`);
      const eventData = {
        owner: repository.owner.login,
        repo: repository.name,
        pullNumber: pull_request.number,
      };

      await this.queue.publish(EVENTS.RECEIVE_PR, eventData);

      this.logger.info(
        `[${WebhookController.name}] 📤 PR #${pull_request.number} enviado para a fila!`
      );
      res.status(200).send("✅ PR adicionado à fila.");
    } catch (error) {
      this.logger.error(`Erro em processar PR: ${error}`);
      res.status(500).send("Internal Server Error");
    }
  }
}
