import { Request, Response } from "express";
import { controller, httpPost, requestBody } from "inversify-express-utils";
import { inject } from "inversify";
import { GitHubService } from "../../../application/github/services/github.services.js";

@controller("/webhook")
export class WebhookController {
  constructor(@inject(GitHubService) private githubService: GitHubService) {}

  @httpPost("/")
  public async handle(
    @requestBody() body: any,
    req: Request,
    res: Response
  ) {
    const { action, pull_request, repository } = req.body;

    if (action !== "opened" && action !== "synchronize" && action !== "reopened") {
      return res.status(200).send("Ignoring event");
    }

    try {
      const reviewComment = await this.githubService.processPullRequest(
        repository.owner.login,
        repository.name,
        pull_request.number
      );

      await this.githubService.commentOnPR(
        repository.owner.login,
        repository.name,
        pull_request.number,
        reviewComment
      );

      res.status(200).send("Review added");
    } catch (error) {
      console.error("Error processing PR:", error);
      res.status(500).send("Internal Server Error");
    }
  }
}
