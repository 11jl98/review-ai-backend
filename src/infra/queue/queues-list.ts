export const QUEUES = {
  REVIEW_PR: "reviewPr",
  LOG: "log",
} as const;

export type Queues = (typeof QUEUES)[keyof typeof QUEUES];
