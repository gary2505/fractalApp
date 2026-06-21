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

export function writeLog(input: LogInput): Promise<void> {
  return bridgeInvoke<void>('log_write', { input });
}

export function readLastLogs(limit = 50): Promise<LogRow[]> {
  return bridgeInvoke<LogRow[]>('log_read_last', { limit });
}
