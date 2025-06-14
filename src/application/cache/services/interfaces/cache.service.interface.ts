export interface CacheServiceInterface {
  cacheReview(files: string[], review: string): Promise<void>;
  findSimilarReview(files: string[]): Promise<string | null>;
}
