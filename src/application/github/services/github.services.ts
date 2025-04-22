import "dotenv/config";
import { inject, injectable } from "inversify";
import { Octokit } from "@octokit/rest";
import { GitHubServiceInterface } from "./interfaces/github.service.interface.js";
import { TYPES } from "src/infra/ioc/types.js";
import { env } from "../../../infra/env/index.js";
import { LoggerInterface } from "src/infra/logger/interfaces/logger.interface.js";
import { AiServiceInterface } from "src/application/ai/services/interfaces/ai.service.interface.js";

@injectable()
export class GitHubService implements GitHubServiceInterface {
  private octokit: Octokit;

  constructor(
    @inject(TYPES.Services.aiService) private aiService: AiServiceInterface,
    @inject(TYPES.logger) private logger: LoggerInterface
  ) {
    this.octokit = new Octokit({ auth: env.GITHUB_TOKEN });
  }

  public async processPullRequest(
    owner: string,
    repo: string,
    pullNumber: number
  ): Promise<string> {
    try {
      this.logger.info(
        `[${GitHubService.name}] processando arquivos do PR: ${pullNumber}`
      );
      const files = await this.octokit.pulls.listFiles({
        owner,
        repo,
        pull_number: pullNumber,
      });

      let codeChanges = "";
      for (const file of files.data) {
        if (file.filename.endsWith(".js") || file.filename.endsWith(".ts")) {
          try {
            const contentResponse = await this.octokit.repos.getContent({
              owner,
              repo,
              path: file.filename,
              ref: `refs/pull/${pullNumber}/head`,
            });

            if ("content" in contentResponse.data) {
              const decodedContent = Buffer.from(
                contentResponse.data.content,
                "base64"
              ).toString("utf-8");
              codeChanges += `\nFile: ${file.filename}\n${decodedContent}\n`;
            }
          } catch (contentError: any) {
            this.logger.warn(
              `⚠️[${GitHubService.name}] Erro ao buscar conteúdo do arquivo ${file.filename}: ${contentError.message}`
            );
          }
        }
      }

      if (!codeChanges) {
        return "No code changes detected.";
      }

      return await this.aiService.processFileToReview(codeChanges);
    } catch (error: any) {
      this.logger.error(`❌ Erro ao processar PR: ${error}`);
      return `Não foi possível processar o PR`;
    }
  }

  public async commentOnPR(
    owner: string,
    repo: string,
    pullNumber: number,
    comment: string
  ): Promise<void> {
    await this.octokit.issues.createComment({
      owner,
      repo,
      issue_number: pullNumber,
      body: `🤖 Code Review Bot:\n\n${comment}`,
    });
  }
}
