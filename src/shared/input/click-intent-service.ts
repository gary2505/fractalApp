export type ClickIntentType = 'single' | 'double' | 'drag' | 'cancel';

export type ClickIntentEvent = {
  type: ClickIntentType;
  sourceEvent: PointerEvent | MouseEvent;
};

export type ClickIntentOptions = {
  fallbackDoubleClickDelayMs?: number;
  minDoubleClickDelayMs?: number;
  maxDoubleClickDelayMs?: number;
  dragDistancePx?: number;
  storageKey?: string;
  now?: () => number;
};

export type ClickIntentHandlers = {
  onIntent: (event: ClickIntentEvent) => void;
};

type PendingClick = {
  event: PointerEvent | MouseEvent;
  time: number;
  x: number;
  y: number;
  timer: ReturnType<typeof setTimeout>;
};

const defaultOptions = {
  fallbackDoubleClickDelayMs: 280,
  minDoubleClickDelayMs: 180,
  maxDoubleClickDelayMs: 520,
  dragDistancePx: 5,
  storageKey: 'fractalapp.ui.double-click-delay-ms',
};

export class ClickIntentService {
  private readonly options: Required<ClickIntentOptions>;
  private pending: PendingClick | null = null;
  private learnedDelayMs: number;

  constructor(options: ClickIntentOptions = {}) {
    this.options = {
      ...defaultOptions,
      now: () => performance.now(),
      ...options,
    };
    this.learnedDelayMs = this.loadDelay();
  }

  get doubleClickDelayMs(): number {
    return this.learnedDelayMs;
  }

  reset(): void {
    if (this.pending) clearTimeout(this.pending.timer);
    this.pending = null;
  }

  handlePointerUp(event: PointerEvent | MouseEvent, handlers: ClickIntentHandlers): void {
    const time = this.options.now();
    const point = { x: event.clientX, y: event.clientY };

    if (!this.pending) {
      this.pending = {
        event,
        time,
        x: point.x,
        y: point.y,
        timer: setTimeout(() => this.flushSingle(handlers), this.learnedDelayMs),
      };
      return;
    }

    const elapsed = time - this.pending.time;
    const distance = Math.hypot(point.x - this.pending.x, point.y - this.pending.y);

    if (distance > this.options.dragDistancePx) {
      clearTimeout(this.pending.timer);
      this.pending = null;
      handlers.onIntent({ type: 'drag', sourceEvent: event });
      return;
    }

    if (elapsed <= this.learnedDelayMs) {
      clearTimeout(this.pending.timer);
      this.learnFromDoubleClick(elapsed);
      this.pending = null;
      handlers.onIntent({ type: 'double', sourceEvent: event });
      return;
    }

    this.flushSingle(handlers);
    this.pending = {
      event,
      time,
      x: point.x,
      y: point.y,
      timer: setTimeout(() => this.flushSingle(handlers), this.learnedDelayMs),
    };
  }

  cancel(event: PointerEvent | MouseEvent, handlers: ClickIntentHandlers): void {
    this.reset();
    handlers.onIntent({ type: 'cancel', sourceEvent: event });
  }

  private flushSingle(handlers: ClickIntentHandlers): void {
    if (!this.pending) return;
    const sourceEvent = this.pending.event;
    clearTimeout(this.pending.timer);
    this.pending = null;
    handlers.onIntent({ type: 'single', sourceEvent });
  }

  private learnFromDoubleClick(elapsedMs: number): void {
    const targetDelay = Math.round(elapsedMs + 80);
    const nextDelay = Math.round(this.learnedDelayMs * 0.7 + targetDelay * 0.3);
    this.learnedDelayMs = this.clampDelay(nextDelay);
    this.saveDelay(this.learnedDelayMs);
  }

  private clampDelay(value: number): number {
    return Math.max(this.options.minDoubleClickDelayMs, Math.min(this.options.maxDoubleClickDelayMs, value));
  }

  private loadDelay(): number {
    if (typeof localStorage === 'undefined') return this.options.fallbackDoubleClickDelayMs;
    const saved = Number(localStorage.getItem(this.options.storageKey));
    if (!Number.isFinite(saved)) return this.options.fallbackDoubleClickDelayMs;
    return this.clampDelay(saved);
  }

  private saveDelay(value: number): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(this.options.storageKey, String(value));
  }
}

export const sharedClickIntentService = new ClickIntentService();
