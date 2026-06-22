import { retryWithBackoff, type RetryOptions } from './backoff';
import { CanceledError, TimeoutError } from './errors';
import { type InflightGate } from './inflight';
import { anySignal } from './signals';
import { withTimeout } from './timeout';
import { createLogger } from '../diag/logger';

const logger = createLogger('request');

export interface RequestPolicy extends RetryOptions {
  timeoutMs?: number;
}

export interface RequestRunOptions {
  opName: string;
  signal?: AbortSignal;
  latestGate?: InflightGate;
  policy?: RequestPolicy;
}

const defaultPolicy: Required<Pick<RequestPolicy, 'timeoutMs' | 'retries' | 'baseDelayMs' | 'maxDelayMs' | 'jitter'>> = {
  timeoutMs: 8000,
  retries: 0,
  baseDelayMs: 250,
  maxDelayMs: 2000,
  jitter: true
};

export class RequestRunner {
  constructor(private readonly globalPolicy: RequestPolicy = {}) {}

  async run<T>(options: RequestRunOptions, task: (signal: AbortSignal) => Promise<T>): Promise<T> {
    const policy = { ...defaultPolicy, ...this.globalPolicy, ...options.policy };
    const latest = options.latestGate?.next();
    const controller = new AbortController();
    const combinedSignal = options.signal ? anySignal([controller.signal, options.signal]) : controller.signal;

    logger.debug('async', 'start', options.opName, { timeoutMs: policy.timeoutMs, retries: policy.retries });

    try {
      const result = await retryWithBackoff(
        (retrySignal) => withTimeout(task, policy.timeoutMs ?? 0, retrySignal),
        {
          retries: policy.retries,
          baseDelayMs: policy.baseDelayMs,
          maxDelayMs: policy.maxDelayMs,
          jitter: policy.jitter,
          shouldRetry: policy.shouldRetry
        },
        combinedSignal
      );

      if (latest && !latest.isCurrent()) throw new CanceledError(`${options.opName} stale result ignored`);

      logger.debug('async', 'success', options.opName);
      return result;
    } catch (error) {
      if (error instanceof CanceledError) logger.debug('async', 'canceled', options.opName);
      else if (error instanceof TimeoutError) logger.warn('async', 'timeout', options.opName, { timeoutMs: policy.timeoutMs });
      else logger.error('async', 'error', options.opName, error);
      throw error;
    }
  }
}

export const requestRunner = new RequestRunner();
