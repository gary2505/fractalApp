import { adaptiveClickTiming } from './action';
import { runExclusive } from './race';

export type ClickKind = 'single' | 'double';

export interface ClickHandlerContext {
  signal: AbortSignal;
}

export interface ClickHandlers {
  onSingle: (event: MouseEvent, context: ClickHandlerContext) => void | Promise<void>;
  onDouble: (event: MouseEvent, context: ClickHandlerContext) => void | Promise<void>;
}

export interface ClickControllerOptions {
  key?: string;
  delayMs?: number;
  doubleClickThresholdMs?: number;
  minDoubleClickIntervalMs?: number;
  maxStreak?: number;
}

export interface ClickStreakInput {
  previousStreak: number;
  intervalMs: number;
  isSameTarget: boolean;
  isNearTarget?: boolean;
  minIntervalMs?: number;
  maxIntervalMs?: number;
  maxStreak?: number;
}

export const MIN_DOUBLE_CLICK_INTERVAL_MS = 30;
export const DEFAULT_DOUBLE_CLICK_THRESHOLD_MS = 400;

export function resolveClickStreak(input: ClickStreakInput): number {
  const minIntervalMs = input.minIntervalMs ?? MIN_DOUBLE_CLICK_INTERVAL_MS;
  const maxIntervalMs = input.maxIntervalMs ?? DEFAULT_DOUBLE_CLICK_THRESHOLD_MS;
  const maxStreak = input.maxStreak ?? 2;
  const isNearTarget = input.isNearTarget ?? false;
  const sequential =
    input.intervalMs > minIntervalMs &&
    input.intervalMs < maxIntervalMs &&
    (input.isSameTarget || isNearTarget);

  if (!sequential) return 1;
  return Math.min(maxStreak, Math.max(1, input.previousStreak) + 1);
}

export function createClickController(handlers: ClickHandlers, options: ClickControllerOptions = {}) {
  const controllerKey = options.key ?? 'click';
  const doubleClickThresholdMs = options.doubleClickThresholdMs ?? DEFAULT_DOUBLE_CLICK_THRESHOLD_MS;
  const minDoubleClickIntervalMs = options.minDoubleClickIntervalMs ?? MIN_DOUBLE_CLICK_INTERVAL_MS;
  const maxStreak = options.maxStreak ?? 2;

  let singleTimer: ReturnType<typeof setTimeout> | null = null;
  let busy = false;
  let currentAbort: AbortController | null = null;
  let pending: { kind: ClickKind; event: MouseEvent } | null = null;
  let lastClickTime = 0;
  let lastClickTarget: EventTarget | null = null;
  let clickStreak = 0;
  let suppressNativeDblUntil = 0;
  let suppressNativeDblTarget: EventTarget | null = null;

  function getDelayMs(): number {
    return Math.max(options.delayMs ?? adaptiveClickTiming.getDelay(), doubleClickThresholdMs);
  }

  function abortCurrent(): void {
    currentAbort?.abort();
    currentAbort = null;
  }

  async function run(kind: ClickKind, event: MouseEvent): Promise<void> {
    pending = null;
    abortCurrent();

    currentAbort = new AbortController();
    const signal = currentAbort.signal;
    busy = true;

    try {
      await runExclusive(
        `${controllerKey}:${kind}`,
        async () => {
          if (signal.aborted) return;
          if (kind === 'single') await handlers.onSingle(event, { signal });
          else await handlers.onDouble(event, { signal });
        },
        { scope: 'ui', action: `${kind}Click` }
      );
    } finally {
      busy = false;
      currentAbort = null;

      if (pending) {
        const next = pending;
        pending = null;
        setTimeout(() => void run(next.kind, next.event), 0);
      }
    }
  }

  function schedule(kind: ClickKind, event: MouseEvent): void {
    pending = { kind, event };
    abortCurrent();

    if (!busy) {
      const next = pending;
      pending = null;
      if (next) void run(next.kind, next.event);
    }
  }

  function onClick(event: MouseEvent): void {
    const now = Date.now();
    const intervalMs = now - lastClickTime;
    const isSameTarget = lastClickTarget === event.target;

    clickStreak = resolveClickStreak({
      previousStreak: clickStreak,
      intervalMs,
      isSameTarget,
      minIntervalMs: minDoubleClickIntervalMs,
      maxIntervalMs: doubleClickThresholdMs,
      maxStreak
    });

    if (clickStreak >= 2) {
      adaptiveClickTiming.learnInterval(intervalMs);
      suppressNativeDblUntil = now + doubleClickThresholdMs;
      suppressNativeDblTarget = event.target;
      lastClickTime = now;
      lastClickTarget = null;
      clickStreak = 0;

      if (singleTimer) clearTimeout(singleTimer);
      singleTimer = null;
      schedule('double', event);
      return;
    }

    lastClickTime = now;
    lastClickTarget = event.target;
    adaptiveClickTiming.recordFirstClick();

    if (singleTimer) clearTimeout(singleTimer);
    singleTimer = setTimeout(() => {
      singleTimer = null;
      schedule('single', event);
    }, getDelayMs());
  }

  function onDoubleClick(event: MouseEvent): void {
    const now = Date.now();
    if (now <= suppressNativeDblUntil && suppressNativeDblTarget === event.target) return;

    adaptiveClickTiming.recordDoubleClick();
    if (singleTimer) clearTimeout(singleTimer);
    singleTimer = null;
    schedule('double', event);
  }

  function destroy(): void {
    if (singleTimer) clearTimeout(singleTimer);
    singleTimer = null;
    pending = null;
    abortCurrent();
  }

  return {
    onClick,
    onDoubleClick,
    isBusy: () => busy,
    destroy,
    abort: abortCurrent
  };
}
