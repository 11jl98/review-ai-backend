import "dotenv/config";
import { inject, injectable } from "inversify";
import { Octokit } from "@octokit/rest";
import axios from "axios";
import { OpenAIService } from "../../openAi/services/openAi.service.js";

@injectable()
export class GitHubService {
  private octokit: Octokit;

  constructor(@inject(OpenAIService) private openAIService: OpenAIService) {
    this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  }

  async processPullRequest(
    owner: string,
    repo: string,
    pullNumber: number
  ): Promise<string> {
    try {
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
            console.warn(
              `⚠️ Erro ao buscar conteúdo do arquivo ${file.filename}:`,
              contentError.message
            );
          }
        }
      }

      if (!codeChanges) {
        return "No code changes detected.";
      }

      return await this.openAIService.analyzeCode(codeChanges);
    } catch (error: any) {
      console.error("❌ Erro ao processar PR:", error);
      return `Não foi possível processar o PR`;
    }
  }

  async commentOnPR(
    owner: string,
    repo: string,
    pullNumber: number,
    comment: string
  ) {
    await this.octokit.issues.createComment({
      owner,
      repo,
      issue_number: pullNumber,
      body: `🤖 Code Review Bot:\n\n${comment}`,
    });
  }
}
