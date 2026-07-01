import { bridgeInvoke } from '../bridge/bridge';
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

// No-op — old log_write removed. smart_log handles all logging.
export function writeLog(_input: LogInput): Promise<void> {
  return bridgeInvoke<void>('log_write');
}

// No-op — old log_read_last removed. smart_log handles all reading.
export function readLastLogs(_limit?: number): Promise<LogRow[]> {
  return bridgeInvoke<LogRow[]>('log_read_last').then(() => []);
}
