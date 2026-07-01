import type { LogId } from './log-ids';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type LogInput = {
  id: LogId;
  level: LogLevel;
  traceId?: string;
  workflowId?: string;
  componentId?: string;
  sessionId?: string;
  msg: string;
  data?: unknown;
};

export type LogRow = LogInput & {
  time: string;
};

// 🔍 SEARCH: True no-op — smart_log handles all logging. Never calls bridge.
// CRITICAL for next agent: Do NOT add bridgeInvoke here.
export function writeLog(_input: LogInput): Promise<void> {
  return Promise.resolve();
}

// 🔍 SEARCH: True no-op — smart_log handles all reading. Never calls bridge.
export function readLastLogs(_limit?: number): Promise<LogRow[]> {
  return Promise.resolve([]);
}
