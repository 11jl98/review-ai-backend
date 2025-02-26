import { inject, injectable } from "inversify";
import { Queue } from "./queue.js";
import { TYPES } from "../ioc/types.js";
import { QUEUES } from "./queues-list.js";
import { GitHubService } from "../../application/github/services/github.services.js";
import { Logger } from "../logger/logger.js";

@injectable()
export class QueueConsumer {
  constructor(
    @inject(TYPES.Queue) private queue: Queue,
    @inject(TYPES.Services.GitHubService) private githubService: GitHubService,
    @inject(TYPES.logger) private logger: Logger
  ) {}

  public async start(): Promise<void> {
    this.queue.consume(QUEUES.REVIEW_PR, async (message: any) => {
      this.logger.info(`📥 PR recebido da fila:${message}`);

      const reviewComment = await this.githubService.processPullRequest(
        message.owner,
        message.repo,
        message.pullNumber
      );
      await this.githubService.commentOnPR(
        message.owner,
        message.repo,
        message.pullNumber,
        reviewComment
      );
      this.logger.info(`✅ PR #${message.pullNumber} analisado e comentado.`);
    });
    this.logger;
  }
}
