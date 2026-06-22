import { createLogger } from '../diag/logger';

const logger = createLogger('race');

const tails = new Map<string, Promise<void>>();
const active = new Set<string>();

export interface RunExclusiveOptions {
  scope?: string;
  action?: string;
  warnOnOverlap?: boolean;
}

export async function runExclusive<T>(
  key: string,
  fn: () => Promise<T>,
  options: RunExclusiveOptions = {}
): Promise<T> {
  const previous = tails.get(key) ?? Promise.resolve();

  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });

  const tail = previous.catch(() => undefined).then(() => gate);
  tails.set(key, tail);

  if (active.has(key) && options.warnOnOverlap !== false) {
    logger.warn(options.scope ?? 'overhead', options.action ?? 'raceCondition', 'serializing overlapping operation', { key });
  }

  await previous.catch(() => undefined);
  active.add(key);

  try {
    return await fn();
  } finally {
    active.delete(key);
    release();
    if (tails.get(key) === tail) tails.delete(key);
  }
}

export function isOperationActive(key: string): boolean {
  return active.has(key);
}

export function getActiveOperations(): string[] {
  return [...active];
}

export function clearOperationState(): void {
  tails.clear();
  active.clear();
}
