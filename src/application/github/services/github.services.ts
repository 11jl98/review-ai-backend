import "dotenv/config";
import { inject, injectable } from "inversify";
import { Octokit } from "@octokit/rest";
import { GitHubServiceInterface } from "./interfaces/github.service.interface.js";
import { TYPES } from "src/infra/ioc/types.js";
import { env } from "../../../infra/env/index.js";
import { LoggerInterface } from "src/infra/logger/interfaces/logger.interface.js";
import { AiServiceInterface } from "src/application/ai/services/interfaces/ai.service.interface.js";
import { createAppAuth } from "@octokit/auth-app";

@injectable()
export class GitHubService implements GitHubServiceInterface {
  private octokit: Octokit;

  constructor(
    @inject(TYPES.Services.AiService) private aiService: AiServiceInterface,
    @inject(TYPES.Logger) private logger: LoggerInterface
  ) {}

  private async authenticateIfNeeded(): Promise<void> {
    if (this.octokit) {
      return;
    }
    const auth = createAppAuth({
      appId: env.GITHUB_APP_ID,
      privateKey: env.GITHUB_APPS_KEY,
      installationId: env.GITHUB_APP_INSTALLATION_ID,
    });
    const { token } = await auth({ type: "installation" });
    this.octokit = new Octokit({ auth: token });
  }

  public async processPullRequest(
    owner: string,
    repo: string,
    pullNumber: number
  ): Promise<string> {
    await this.authenticateIfNeeded();

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
      const relevantFiles = this.filteredModificateFiles(files);
      for (const file of relevantFiles.data) {
        if (file.filename.endsWith(".js") || file.filename.endsWith(".ts")) {
          try {
            const contentResponse = await this.octokit!.repos.getContent({
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
        return "Alterações não detectadas.";
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
    await this.authenticateIfNeeded();
    await this.octokit.issues.createComment({
      owner,
      repo,
      issue_number: pullNumber,
      body: `🤖 Code Review Bot:\n\n${comment}`,
    });
  }

  private filteredModificateFiles(files: any) {
    const allowedStatuses = new Set([
      "added",
      "modified",
      "renamed",
      "copied",
      "changed",
    ]);
    const relevantFiles = files.filter((file) =>
      allowedStatuses.has(file.status)
    );
    return relevantFiles.map((file) => file.filename);
  }
}
