export type SmartLogMode = 'app' | 'issue';

export type SmartLogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export type SmartLogKind =
  | 'boot'
  | 'ui'
  | 'panel'
  | 'state'
  | 'error'
  | 'fatal'
  | 'agent'
  | 'verify'
  | 'perf'
  | 'trace'
  | 'system';

export type SmartLogTag =
  | 'APP'
  | 'BOT'
  | 'UI'
  | 'PAN'
  | 'STA'
  | 'ERR'
  | 'FAT'
  | 'AGT'
  | 'VER'
  | 'PER'
  | 'TRC'
  | 'SYS';

export type SmartLogOutcome = 'ok' | 'skip' | 'cancel' | 'error' | 'timeout';

export type SmartTrace = {
  sid: string;
  rid: string;
  span: number;
  p: number | undefined;
};

export type SmartLogContext = Record<string, unknown>;
export type SmartLogData = Record<string, unknown>;

export type SmartLogEvent = {
  v: 1 | 2;
  ts: string;
  t: string;
  l: SmartLogLevel;
  mode: SmartLogMode;
  kind: SmartLogKind;
  tag: SmartLogTag;
  id: string;
  sid: string;
  rid: string;
  span: number;
  p: number | undefined;
  a: string;
  e: string;
  m: string;
  c: SmartLogContext | undefined;
  d: SmartLogData | undefined;
};

export type SmartLogInput = {
  mode?: SmartLogMode;
  level?: SmartLogLevel;
  kind: SmartLogKind;
  tag?: SmartLogTag;
  id?: string;
  actor: string;
  event: string;
  msg?: string;
  trace?: Partial<SmartTrace>;
  ctx?: SmartLogContext;
  data?: SmartLogData;
  sample?: boolean;
  slowThresholdMs?: number;
};

export type SmartLoggerDefaults = {
  actor: string;
  kind?: SmartLogKind;
  tag?: SmartLogTag;
  mode?: SmartLogMode;
  ctx?: SmartLogContext;
};

export type SmartTraceOpInput = Omit<SmartLogInput, 'event' | 'data'> & {
  op: string;
  startEvent?: string;
  endEvent?: string;
  data?: SmartLogData;
};

export type SmartLogReadFile = 'app' | 'issue' | 'error';

export type SmartLogWriteResult = {
  ok: boolean;
  backend: 'smart' | 'legacy' | 'memory';
  event: SmartLogEvent;
  error?: string;
};
