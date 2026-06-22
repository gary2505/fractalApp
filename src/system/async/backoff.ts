import { CanceledError, isAbortLikeError } from './errors';

export interface RetryOptions {
  retries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  jitter?: boolean;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
}

const defaultShouldRetry = (error: unknown) => !isAbortLikeError(error);

export async function retryWithBackoff<T>(
  task: (signal: AbortSignal) => Promise<T>,
  options: RetryOptions = {},
  signal?: AbortSignal
): Promise<T> {
  const retries = options.retries ?? 0;
  const baseDelayMs = options.baseDelayMs ?? 200;
  const maxDelayMs = options.maxDelayMs ?? 2000;
  const jitter = options.jitter ?? true;
  const shouldRetry = options.shouldRetry ?? defaultShouldRetry;

  let attempt = 0;
  let lastError: unknown;

  while (attempt <= retries) {
    if (signal?.aborted) throw new CanceledError('Retry canceled');

    try {
      return await task(signal ?? new AbortController().signal);
    } catch (error) {
      lastError = error;
      if (attempt >= retries || !shouldRetry(error, attempt)) throw error;

      const delayMs = computeDelay(baseDelayMs, maxDelayMs, attempt, jitter);
      await delay(delayMs, signal);
      attempt++;
    }
  }

  throw lastError;
}

function computeDelay(baseDelayMs: number, maxDelayMs: number, attempt: number, jitter: boolean): number {
  const raw = Math.min(maxDelayMs, baseDelayMs * 2 ** attempt);
  if (!jitter) return raw;
  return Math.round(raw * (0.75 + Math.random() * 0.5));
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new CanceledError('Delay canceled'));
      return;
    }

    const timer = setTimeout(resolve, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(new CanceledError('Delay canceled'));
    };

    signal?.addEventListener('abort', onAbort, { once: true });
  });
}
