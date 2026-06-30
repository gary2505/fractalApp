export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type LogScope =
  | 'boot'
  | 'ui'
  | 'async'
  | 'runtime'
  | 'diag'
  | 'agent'
  | 'system'
  | 'overhead'
  | string;

export interface LogEvent {
  ts: number;
  level: LogLevel;
  channel: string;
  scope: LogScope;
  action: string;
  message: string;
  traceId?: string;
  data?: Record<string, unknown>;
  error?: unknown;
}

export type LogSink = (event: LogEvent) => void;

export interface LoggerLiteOptions {
  channel?: string;
  minLevel?: LogLevel;
  sink?: LogSink;
  devOnlyDebug?: boolean;
}

const levelRank: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40
};

function isDevRuntime(): boolean {
  try {
    const meta = import.meta as ImportMeta & { env?: { DEV?: boolean } };
    return Boolean(meta.env?.DEV);
  } catch {
    return false;
  }
}

function defaultSink(event: LogEvent): void {
  const prefix = `[${event.channel}] ${event.scope}.${event.action}`;
  const payload = event.data ?? event.error;

  if (event.level === 'debug') console.debug(prefix, event.message, payload ?? '');
  else if (event.level === 'info') console.info(prefix, event.message, payload ?? '');
  else if (event.level === 'warn') console.warn(prefix, event.message, payload ?? '');
  else console.error(prefix, event.message, payload ?? '');
}

export class LoggerLite {
  private readonly channel: string;
  private readonly minLevel: LogLevel;
  private readonly sink: LogSink;
  private readonly devOnlyDebug: boolean;

  constructor(options: LoggerLiteOptions = {}) {
    this.channel = options.channel ?? 'system';
    this.minLevel = options.minLevel ?? 'info';
    this.sink = options.sink ?? defaultSink;
    this.devOnlyDebug = options.devOnlyDebug ?? true;
  }

  child(channel: string): LoggerLite {
    return new LoggerLite({
      channel,
      minLevel: this.minLevel,
      sink: this.sink,
      devOnlyDebug: this.devOnlyDebug
    });
  }

  debug(scope: LogScope, action: string, message: string, data?: Record<string, unknown>): void {
    this.emit('debug', scope, action, message, data);
  }

  info(scope: LogScope, action: string, message: string, data?: Record<string, unknown>): void {
    this.emit('info', scope, action, message, data);
  }

  warn(scope: LogScope, action: string, message: string, data?: Record<string, unknown>): void {
    this.emit('warn', scope, action, message, data);
  }

  error(scope: LogScope, action: string, message: string, error?: unknown, data?: Record<string, unknown>): void {
    this.emit('error', scope, action, message, data, error);
  }

  private emit(
    level: LogLevel,
    scope: LogScope,
    action: string,
    message: string,
    data?: Record<string, unknown>,
    error?: unknown
  ): void {
    if (level === 'debug' && this.devOnlyDebug && !isDevRuntime()) return;
    if (levelRank[level] < levelRank[this.minLevel]) return;

    this.sink({
      ts: Date.now(),
      level,
      channel: this.channel,
      scope,
      action,
      message,
      ...(data !== undefined ? { data } : {}),
      ...(error !== undefined ? { error } : {})
    });
  }
}

export const systemLogger = new LoggerLite({ channel: 'system' });

export function createLogger(channel: string): LoggerLite {
  return systemLogger.child(channel);
}
