import { injectable } from "inversify";
import { Octokit } from "@octokit/rest";
import axios from "axios";
import { OpenAIService } from "../../openAi/services/openAi.service.js";

@injectable()
export class GitHubService {
  private octokit: Octokit;

  constructor(private openAIService: OpenAIService) {
    this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  }

  async processPullRequest(
    owner: string,
    repo: string,
    pullNumber: number
  ): Promise<string> {
    const files = await this.octokit.pulls.listFiles({
      owner,
      repo,
      pull_number: pullNumber,
    });

    let codeChanges = "";
    for (const file of files.data) {
      if (file.filename.endsWith(".js") || file.filename.endsWith(".ts")) {
        const content = await axios.get(file.raw_url);
        codeChanges += `\nFile: ${file.filename}\n${content.data}\n`;
      }
    }

    if (!codeChanges) {
      return "No code changes detected.";
    }

    return await this.openAIService.analyzeCode(codeChanges);
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
