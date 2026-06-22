import { TimeoutError } from './errors';

export async function withTimeout<T>(
  task: (signal: AbortSignal) => Promise<T>,
  timeoutMs: number,
  outerSignal?: AbortSignal
): Promise<T> {
  if (!timeoutMs || timeoutMs <= 0) return task(outerSignal ?? new AbortController().signal);

  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort(new TimeoutError(`Timed out after ${timeoutMs}ms`));
  }, timeoutMs);

  const onOuterAbort = () => controller.abort(outerSignal?.reason);
  outerSignal?.addEventListener('abort', onOuterAbort, { once: true });

  try {
    return await task(controller.signal);
  } catch (error) {
    if (controller.signal.aborted && controller.signal.reason instanceof TimeoutError) {
      throw controller.signal.reason;
    }
    throw error;
  } finally {
    clearTimeout(timer);
    outerSignal?.removeEventListener('abort', onOuterAbort);
  }
}
