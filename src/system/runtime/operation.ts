export type OperationCancelReason = 'manual' | 'timeout' | 'replaced';

export type OperationKind =
  | 'boot'
  | 'component-load'
  | 'component-update'
  | 'settings-save'
  | 'ai-task'
  | 'agent-gate'
  | 'file-read'
  | 'native-invoke'
  | 'other'
  | string;

export type OperationOwner = 'core' | 'app' | 'block' | 'agent' | 'ui' | 'system' | string;

export interface OperationInfo {
  operationId: string;
  kind: OperationKind;
  owner: OperationOwner;
  label?: string;
  startTime: number;
  lastActivity: number;
  lastEventLabel?: string;
  timeoutMs?: number;
  ended?: number;
  canceled?: boolean;
  cancelReason?: OperationCancelReason;
  paused?: boolean;
  meta?: Record<string, unknown>;
}

export interface StartOperationOptions {
  operationId: string;
  kind: OperationKind;
  owner: OperationOwner;
  label?: string;
  timeoutMs?: number;
  meta?: Record<string, unknown>;
}

export type OperationCancelListener = (reason: OperationCancelReason, info: OperationInfo) => void;

export class OperationRuntime {
  private readonly operations = new Map<string, OperationInfo>();
  private readonly cancelListeners = new Map<string, Set<OperationCancelListener>>();
  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();

  start(options: StartOperationOptions): void {
    const now = Date.now();
    const info: OperationInfo = {
      operationId: options.operationId,
      kind: options.kind,
      owner: options.owner,
      ...(options.label !== undefined ? { label: options.label } : {}),
      ...(options.timeoutMs !== undefined ? { timeoutMs: options.timeoutMs } : {}),
      ...(options.meta !== undefined ? { meta: options.meta } : {}),
      startTime: now,
      lastActivity: now
    };

    this.operations.set(options.operationId, info);
    if (info.timeoutMs && info.timeoutMs > 0) this.installTimeout(options.operationId, info.timeoutMs);
  }

  end(operationId: string): void {
    const info = this.operations.get(operationId);
    if (!info) return;

    info.ended = Date.now();
    this.clearTimeout(operationId);
    this.cancelListeners.delete(operationId);
    this.operations.delete(operationId);
  }

  touch(operationId: string, eventLabel?: string, timeoutMs?: number): void {
    const info = this.operations.get(operationId);
    if (!info) return;

    info.lastActivity = Date.now();
    if (eventLabel) info.lastEventLabel = eventLabel;
    if (timeoutMs !== undefined) info.timeoutMs = timeoutMs;

    if (info.timeoutMs && info.timeoutMs > 0) this.installTimeout(operationId, info.timeoutMs);
    else this.clearTimeout(operationId);
  }

  onCancel(operationId: string, listener: OperationCancelListener): () => void {
    let set = this.cancelListeners.get(operationId);
    if (!set) {
      set = new Set();
      this.cancelListeners.set(operationId, set);
    }

    set.add(listener);
    return () => set?.delete(listener);
  }

  cancel(operationId: string, reason: OperationCancelReason = 'manual'): void {
    this.internalCancel(operationId, reason);
  }

  pause(operationId: string): void {
    const info = this.operations.get(operationId);
    if (info) info.paused = true;
  }

  resume(operationId: string): void {
    const info = this.operations.get(operationId);
    if (info) info.paused = false;
  }

  isActive(operationId: string): boolean {
    return this.operations.has(operationId);
  }

  get(operationId: string): OperationInfo | undefined {
    const info = this.operations.get(operationId);
    return info ? { ...info, ...(info.meta ? { meta: { ...info.meta } } : {}) } : undefined;
  }

  list(filter?: { owner?: OperationOwner; kind?: OperationKind }): OperationInfo[] {
    return [...this.operations.values()]
      .filter((item) => !filter?.owner || item.owner === filter.owner)
      .filter((item) => !filter?.kind || item.kind === filter.kind)
      .map((item) => ({ ...item, ...(item.meta ? { meta: { ...item.meta } } : {}) }))
      .sort((a, b) => a.startTime - b.startTime);
  }

  clear(): void {
    for (const operationId of this.operations.keys()) this.clearTimeout(operationId);
    this.operations.clear();
    this.cancelListeners.clear();
  }

  private internalCancel(operationId: string, reason: OperationCancelReason): void {
    const info = this.operations.get(operationId);
    if (!info) return;

    info.canceled = true;
    info.cancelReason = reason;
    info.ended = Date.now();

    const snapshot = { ...info, ...(info.meta ? { meta: { ...info.meta } } : {}) };
    const listeners = [...(this.cancelListeners.get(operationId) ?? [])];

    for (const listener of listeners) {
      try {
        listener(reason, snapshot);
      } catch {
        // Operation runtime must never crash because a listener failed.
      }
    }

    this.clearTimeout(operationId);
    this.cancelListeners.delete(operationId);
    this.operations.delete(operationId);
  }

  private installTimeout(operationId: string, timeoutMs: number): void {
    this.clearTimeout(operationId);

    const timer = setTimeout(() => {
      const info = this.operations.get(operationId);
      if (!info) return;

      const ageMs = Date.now() - info.lastActivity;
      const activeTimeoutMs = info.timeoutMs ?? timeoutMs;

      if (ageMs >= activeTimeoutMs) {
        this.internalCancel(operationId, 'timeout');
        return;
      }

      this.installTimeout(operationId, Math.max(1, activeTimeoutMs - ageMs));
    }, timeoutMs);

    this.timers.set(operationId, timer);
  }

  private clearTimeout(operationId: string): void {
    const timer = this.timers.get(operationId);
    if (!timer) return;

    clearTimeout(timer);
    this.timers.delete(operationId);
  }
}

export const operationRuntime = new OperationRuntime();
