export const EVENTS = {
  LOG: "log",
  RECEIVE_PR: "receivePr",
} as const;

export type EventsTypes = (typeof EVENTS)[keyof typeof EVENTS];
