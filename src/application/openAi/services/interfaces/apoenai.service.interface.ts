export interface OpenAIServiceInterface {
  processFileToReview(code: string): Promise<string>;
}
