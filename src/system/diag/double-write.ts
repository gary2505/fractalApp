import { createLogger } from './logger';

const logger = createLogger('double-write');

export interface DoubleWriteDetectorOptions {
  enabled?: boolean;
  suppressMs?: number;
  cleanupAgeMs?: number;
}

interface CounterState {
  count: number;
  lastTs: number;
}

export class DoubleWriteDetector {
  private readonly lastHashes = new Map<string, number>();
  private readonly counters = new Map<string, CounterState>();
  private readonly enabled: boolean;
  private readonly suppressMs: number;
  private readonly cleanupAgeMs: number;

  constructor(options: DoubleWriteDetectorOptions = {}) {
    this.enabled = options.enabled ?? isDevRuntime();
    this.suppressMs = options.suppressMs ?? 500;
    this.cleanupAgeMs = options.cleanupAgeMs ?? 60_000;
  }

  detect(store: string, field: string, value: unknown): void {
    if (!this.enabled) return;

    const key = `${store}.${field}`;
    const hash = simpleHash(value);
    const previousHash = this.lastHashes.get(key);

    if (previousHash === hash) {
      this.warnThrottled(key, { store, field }, `no-op write: ${key}`);
    }

    this.lastHashes.set(key, hash);
  }

  detectWithDiff(store: string, field: string, oldValue: unknown, newValue: unknown): void {
    if (!this.enabled) return;
    if (stableStringify(oldValue) !== stableStringify(newValue)) return;

    const key = `${store}.${field}`;
    this.warnThrottled(key, { store, field }, `no-op write old === new: ${key}`);
  }

  clear(): void {
    this.lastHashes.clear();
    this.counters.clear();
  }

  cleanupOldEntries(): void {
    const now = performance.now();
    for (const [key, counter] of this.counters.entries()) {
      if (now - counter.lastTs <= this.cleanupAgeMs) continue;
      this.counters.delete(key);
      this.lastHashes.delete(key);
    }
  }

  private warnThrottled(key: string, data: Record<string, unknown>, message: string): void {
    const now = performance.now();
    const counter = this.counters.get(key) ?? { count: 0, lastTs: 0 };
    counter.count++;

    if (now - counter.lastTs > this.suppressMs) {
      logger.warn('overhead', 'doubleWrite', message, { key, count: counter.count, ...data });
      counter.lastTs = now;
      counter.count = 1;
    }

    this.counters.set(key, counter);
  }
}

function isDevRuntime(): boolean {
  try {
    const meta = import.meta as ImportMeta & { env?: { DEV?: boolean } };
    return Boolean(meta.env?.DEV);
  } catch {
    return false;
  }
}

function stableStringify(value: unknown): string {
  try {
    return typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value);
  } catch {
    return String(value);
  }
}

function simpleHash(value: unknown): number {
  const input = stableStringify(value);
  let hash = 0;

  for (let index = 0; index < input.length; index++) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }

  return hash;
}

export const doubleWriteDetector = new DoubleWriteDetector();

export function detectDoubleWrite(store: string, field: string, value: unknown): void {
  doubleWriteDetector.detect(store, field, value);
}

export function detectDoubleWriteWithDiff(store: string, field: string, oldValue: unknown, newValue: unknown): void {
  doubleWriteDetector.detectWithDiff(store, field, oldValue, newValue);
}
