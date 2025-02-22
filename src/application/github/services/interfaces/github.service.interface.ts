export interface GitHubServiceInterface {
  processPullRequest(
    owner: string,
    repo: string,
    pullNumber: number
  ): Promise<string>;
  commentOnPR(
    owner: string,
    repo: string,
    pullNumber: number,
    comment: string
  ): Promise<void>;
}
