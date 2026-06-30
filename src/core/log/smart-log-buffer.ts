import { SMART_LOG_LIMITS } from './smart-log-config';
import type { SmartLogEvent } from './smart-log-types';

type Listener = (event: SmartLogEvent) => void;

const rows: SmartLogEvent[] = [];
const listeners = new Set<Listener>();

export function pushSmartLogMemory(event: SmartLogEvent): void {
  rows.push(event);
  if (rows.length > SMART_LOG_LIMITS.memoryRows) {
    rows.splice(0, rows.length - SMART_LOG_LIMITS.memoryRows);
  }
  for (const listener of listeners) {
    try {
      listener(event);
    } catch {
      // Logging must never break the app.
    }
  }
}

export function readSmartLogMemory(limit = 200): SmartLogEvent[] {
  return rows.slice(-Math.max(0, Math.min(limit, SMART_LOG_LIMITS.memoryRows)));
}

export function clearSmartLogMemory(): void {
  rows.length = 0;
}

export function subscribeSmartLogMemory(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
