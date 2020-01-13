export type ErrorCode = "event/idempotent-conflict" | "unknown";

export interface ErrorDetails {
  originalError?: Error;
  [key: string]: any;
}

export class ApplicationError extends Error {
  constructor(public code: ErrorCode, public details?: ErrorDetails) {
    super(code);
  }
}

export class EventIdempotentError extends ApplicationError {
  constructor(public details?: ErrorDetails) {
    super("event/idempotent-conflict", details);
  }
}

export class UnkownError extends ApplicationError {
  constructor(public details?: ErrorDetails) {
    super("unknown", details);
  }
}
