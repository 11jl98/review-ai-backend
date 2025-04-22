export interface AiServiceInterface {
  processFileToReview(code: string): Promise<string>;
}
