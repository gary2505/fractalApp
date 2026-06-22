export class CanceledError extends Error {
  constructor(message = 'Operation canceled') {
    super(message);
    this.name = 'CanceledError';
  }
}

export class TimeoutError extends Error {
  constructor(message = 'Operation timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}

export function isAbortLikeError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const maybe = error as { name?: string };
  return maybe.name === 'AbortError' || maybe.name === 'CanceledError';
}
