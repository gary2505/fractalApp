export interface ClickTimingSnapshot {
  intervals: number[];
  delayMs: number;
}

export interface ClickTimingStorage {
  load: () => ClickTimingSnapshot | null | Promise<ClickTimingSnapshot | null>;
  save: (snapshot: ClickTimingSnapshot) => void | Promise<void>;
}

export interface AdaptiveClickTimingOptions {
  maxSamples?: number;
  defaultDelayMs?: number;
  minDelayMs?: number;
  maxDelayMs?: number;
  minLearnMs?: number;
  maxLearnMs?: number;
}

export class AdaptiveClickTiming {
  private intervals: number[] = [];
  private lastClickTime = 0;
  private storage?: ClickTimingStorage;
  private readonly maxSamples: number;
  private readonly defaultDelayMs: number;
  private readonly minDelayMs: number;
  private readonly maxDelayMs: number;
  private readonly minLearnMs: number;
  private readonly maxLearnMs: number;

  constructor(options: AdaptiveClickTimingOptions = {}) {
    this.maxSamples = options.maxSamples ?? 5;
    this.defaultDelayMs = options.defaultDelayMs ?? 220;
    this.minDelayMs = options.minDelayMs ?? 120;
    this.maxDelayMs = options.maxDelayMs ?? 420;
    this.minLearnMs = options.minLearnMs ?? 50;
    this.maxLearnMs = options.maxLearnMs ?? 600;
  }

  async hydrate(storage: ClickTimingStorage): Promise<void> {
    this.storage = storage;
    try {
      const snapshot = await storage.load();
      if (snapshot && Array.isArray(snapshot.intervals)) {
        this.intervals = snapshot.intervals
          .filter((n) => Number.isFinite(n) && n >= this.minLearnMs && n <= this.maxLearnMs)
          .slice(-this.maxSamples);
      }
    } catch {
      this.intervals = [];
    }
  }

  recordFirstClick(): void {
    this.lastClickTime = Date.now();
  }

  recordDoubleClick(): void {
    const now = Date.now();
    if (this.lastClickTime > 0) this.learnInterval(now - this.lastClickTime);
    this.lastClickTime = now;
  }

  learnInterval(intervalMs: number): void {
    if (!Number.isFinite(intervalMs)) return;
    if (intervalMs < this.minLearnMs || intervalMs > this.maxLearnMs) return;

    this.intervals.push(Math.round(intervalMs));
    if (this.intervals.length > this.maxSamples) this.intervals.shift();
    this.persist();
  }

  getDelay(): number {
    if (this.intervals.length < Math.min(3, this.maxSamples)) return this.defaultDelayMs;

    const sorted = [...this.intervals].sort((a, b) => a - b);
    const p90Index = Math.min(sorted.length - 1, Math.floor(sorted.length * 0.9));
    const p90 = sorted[p90Index] ?? this.defaultDelayMs;
    const withBuffer = Math.round(p90 * 1.2);

    return clamp(withBuffer, this.minDelayMs, this.maxDelayMs);
  }

  getRapidThreshold(): number {
    return Math.max(80, Math.round(this.getDelay() * 0.4));
  }

  getStats(): { intervals: number[]; delayMs: number; rapidThresholdMs: number; samples: number } {
    return {
      intervals: [...this.intervals],
      delayMs: this.getDelay(),
      rapidThresholdMs: this.getRapidThreshold(),
      samples: this.intervals.length
    };
  }

  reset(): void {
    this.intervals = [];
    this.lastClickTime = 0;
    this.persist();
  }

  private persist(): void {
    const storage = this.storage;
    if (!storage) return;
    void storage.save({ intervals: [...this.intervals], delayMs: this.getDelay() });
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

const timers = new Map<string, number>();
const inflight = new Map<string, Promise<unknown>>();

export const adaptiveClickTiming = new AdaptiveClickTiming();

export function forbidRapidRepeat(key: string, minMs?: number): boolean {
  const threshold = minMs ?? adaptiveClickTiming.getRapidThreshold();
  const now = Date.now();
  const last = timers.get(key) ?? 0;

  if (now - last < threshold) return false;
  timers.set(key, now);
  return true;
}

export function singleFlight<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = inflight.get(key) as Promise<T> | undefined;
  if (existing) return existing;

  const promise = fn().finally(() => inflight.delete(key));
  inflight.set(key, promise);
  return promise;
}

export function epochGuard(): { next: () => number; isCurrent: (epoch: number) => boolean; invalidate: () => void } {
  let epoch = 0;

  return {
    next: () => ++epoch,
    isCurrent: (candidate: number) => candidate === epoch,
    invalidate: () => {
      epoch++;
    }
  };
}

export function resetActionGate(key?: string): void {
  if (key) {
    timers.delete(key);
    inflight.delete(key);
    return;
  }

  timers.clear();
  inflight.clear();
}
