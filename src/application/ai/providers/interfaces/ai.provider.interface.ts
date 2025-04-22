export interface AiProviderInterface {
  generate(fileReview: string): Promise<string>;
}
