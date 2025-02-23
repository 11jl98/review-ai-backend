import { inject, injectable } from "inversify";
import { Queue } from "./queue.js";
import { TYPES } from "../ioc/types.js";
import { QUEUES } from "./queues-list.js";
import { GitHubService } from "src/application/github/services/github.services.js";

@injectable()
export class QueueConsumer {
  constructor(
    @inject(TYPES.Queue) private queue: Queue,
    @inject(TYPES.Services.GitHubService) private githubService: GitHubService
  ) {}

  public async start(): Promise<void> {
    this.queue.consume(QUEUES.REVIEW_PR, async (message: any) => {
      console.log("📥 PR recebido da fila:", message);

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
      console.log(`✅ PR #${message.pullNumber} analisado e comentado.`);
    });
  }
}
