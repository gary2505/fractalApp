import type { SmartLogKind, SmartLogLevel, SmartLogTag } from './smart-log-types';

export const SMART_LOG_VERSION = 2 as const;

export const SMART_LOG_FILES = {
  app: 'app-run.jsonl',
  issue: 'issue-current.jsonl',
  error: 'error.jsonl'
} as const;

export const SMART_LOG_LIMITS = {
  maxMessage: 120,
  maxString: 600,
  maxDataDepth: 4,
  maxArrayItems: 40,
  maxObjectKeys: 60,
  memoryRows: 2000,
  readLimit: 1000,
  appRotateBytes: 5 * 1024 * 1024,
  issueRotateBytes: 2 * 1024 * 1024,
  errorRotateBytes: 2 * 1024 * 1024
} as const;

export const SMART_LOG_THRESHOLDS: Record<SmartLogKind, number> = {
  boot: 100,
  ui: 50,
  panel: 50,
  state: 16,
  error: 0,
  fatal: 0,
  agent: 200,
  verify: 200,
  perf: 50,
  trace: 50,
  system: 100
};

export const SMART_LOG_SAMPLE_RATE: Record<SmartLogKind, number> = {
  boot: 1,
  ui: 0.05,
  panel: 1,
  state: 0.01,
  error: 1,
  fatal: 1,
  agent: 1,
  verify: 1,
  perf: 0.1,
  trace: 0.05,
  system: 0.1
};

export const SMART_LOG_TAG_BY_KIND: Record<SmartLogKind, SmartLogTag> = {
  boot: 'BOT',
  ui: 'UI',
  panel: 'PAN',
  state: 'STA',
  error: 'ERR',
  fatal: 'FAT',
  agent: 'AGT',
  verify: 'VER',
  perf: 'PER',
  trace: 'TRC',
  system: 'SYS'
};

export const SMART_LOG_LEVEL_ORDER: Record<SmartLogLevel, number> = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60
};

export const SMART_LOG_REDACT_KEYS = [
  'password',
  'pass',
  'token',
  'secret',
  'apiKey',
  'apikey',
  'authorization',
  'cookie',
  'sessionToken',
  'privateKey'
] as const;

export const SMART_LOG_DEFAULTS = {
  minLevel: 'info' as SmartLogLevel,
  console: false,
  memory: true,
  backend: true,
  fallbackToLegacy: true
};

export function shouldAlwaysWrite(level: SmartLogLevel, kind: SmartLogKind): boolean {
  return level === 'error' || level === 'fatal' || kind === 'boot' || kind === 'agent' || kind === 'verify';
}
