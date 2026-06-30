import { bridgeInvoke } from '../bridge/bridge';
import { writeLog } from './log';
import {
  SMART_LOG_DEFAULTS,
  SMART_LOG_LEVEL_ORDER,
  SMART_LOG_SAMPLE_RATE,
  SMART_LOG_TAG_BY_KIND,
  SMART_LOG_THRESHOLDS,
  SMART_LOG_VERSION,
  shouldAlwaysWrite
} from './smart-log-config';
import { pushSmartLogMemory } from './smart-log-buffer';
import { sanitizeMsg, sanitizeObject } from './smart-log-sanitize';
import { nextSmartTrace, smartBootT, smartSessionId, startSmartRequest } from './smart-log-trace';
import type {
  SmartLogData,
  SmartLogEvent,
  SmartLogInput,
  SmartLoggerDefaults,
  SmartLogLevel,
  SmartLogMode,
  SmartLogWriteResult,
  SmartTraceOpInput
} from './smart-log-types';

type SmartLogRuntimeConfig = {
  minLevel: SmartLogLevel;
  console: boolean;
  memory: boolean;
  backend: boolean;
  fallbackToLegacy: boolean;
  issueEnabled: boolean;
};

const config: SmartLogRuntimeConfig = {
  ...SMART_LOG_DEFAULTS,
  issueEnabled: false
};

function normalizeLevel(level?: SmartLogLevel): SmartLogLevel {
  return level ?? 'info';
}

function shouldWrite(input: SmartLogInput, event: SmartLogEvent): boolean {
  if (input.mode === 'issue' && !config.issueEnabled) return false;
  if (event.mode !== 'issue' && SMART_LOG_LEVEL_ORDER[event.l] < SMART_LOG_LEVEL_ORDER[config.minLevel]) return false;
  if (event.mode === 'issue' || input.sample === false || shouldAlwaysWrite(event.l, event.kind)) return true;

  const totalMs = Number(event.d?.totalMs ?? 0);
  const threshold = input.slowThresholdMs ?? SMART_LOG_THRESHOLDS[event.kind];
  if (totalMs >= threshold) return true;

  const rate = SMART_LOG_SAMPLE_RATE[event.kind];
  return Math.random() < rate;
}

function legacyIdFor(event: SmartLogEvent): string {
  if (event.kind === 'boot') return event.l === 'error' || event.l === 'fatal' ? 'core.boot.err' : 'core.boot.ok';
  if (event.kind === 'state') return 'state.next';
  if (event.kind === 'agent') return event.l === 'error' || event.l === 'fatal' ? 'ai.patch.apply.err' : 'ai.patch.plan';
  if (event.kind === 'verify') return event.l === 'error' || event.l === 'fatal' ? 'ai.patch.gate.err' : 'ai.patch.gate.ok';
  if (event.l === 'error' || event.l === 'fatal') return 'health.check.err';
  return 'health.check.ok';
}

function buildEvent(input: SmartLogInput): SmartLogEvent {
  const trace = nextSmartTrace(input.trace);
  const level = normalizeLevel(input.level);
  const mode: SmartLogMode = input.mode ?? 'app';
  const data = sanitizeObject(input.data);
  const ctx = sanitizeObject(input.ctx);

  return {
    v: SMART_LOG_VERSION,
    ts: new Date().toISOString(),
    t: smartBootT(),
    l: level,
    mode,
    kind: input.kind,
    tag: input.tag ?? SMART_LOG_TAG_BY_KIND[input.kind],
    id: input.id ?? `${input.kind}.${input.event}`,
    sid: trace.sid,
    rid: trace.rid,
    span: trace.span,
    p: trace.p,
    a: sanitizeMsg(input.actor) || 'unknown',
    e: sanitizeMsg(input.event) || 'event',
    m: sanitizeMsg(input.msg ?? input.event),
    c: ctx,
    d: data
  };
}

async function writeSmartBackend(event: SmartLogEvent): Promise<'smart' | 'legacy' | 'memory'> {
  if (!config.backend) return 'memory';

  try {
    await bridgeInvoke('smart_log_write', { input: event });
    return 'smart';
  } catch (smartError) {
    if (!config.fallbackToLegacy) throw smartError;

    await writeLog({
      id: legacyIdFor(event) as never,
      level: event.l === 'fatal' ? 'error' : event.l === 'trace' ? 'debug' : event.l,
      traceId: event.rid,
      workflowId: event.id,
      componentId: event.a,
      sessionId: event.sid,
      msg: event.m,
      data: event
    });
    return 'legacy';
  }
}

function writeConsole(event: SmartLogEvent): void {
  if (!config.console) return;
  const line = `SLOG [${event.tag}] ${event.t} ${event.a}.${event.e} ${event.m}`;
  if (event.l === 'error' || event.l === 'fatal') console.error(line, event);
  else if (event.l === 'warn') console.warn(line, event);
  else console.info(line, event);
}

export function configureSmartLog(next: Partial<SmartLogRuntimeConfig>): void {
  Object.assign(config, next);
}

export function enableIssueTrace(enabled = true): void {
  config.issueEnabled = enabled;
}

export function beginSmartUserAction(prefix = 'r'): string {
  return startSmartRequest(prefix);
}

export async function smartLog(input: SmartLogInput): Promise<SmartLogWriteResult> {
  const event = buildEvent(input);
  if (!shouldWrite(input, event)) {
    return { ok: true, backend: 'memory', event };
  }

  if (config.memory) pushSmartLogMemory(event);
  writeConsole(event);

  try {
    const backend = await writeSmartBackend(event);
    return { ok: true, backend, event };
  } catch (error) {
    return {
      ok: false,
      backend: 'memory',
      event,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

export function createSmartLogger(defaults: SmartLoggerDefaults) {
  const base = (level: SmartLogLevel, event: string, msg?: string, data?: SmartLogData, extra?: Partial<SmartLogInput>) => {
    const input: SmartLogInput = {
      kind: defaults.kind ?? 'ui',
      actor: defaults.actor,
      level,
      event
    };
    if (msg !== undefined) input.msg = msg;
    if (defaults.mode !== undefined) input.mode = defaults.mode;
    if (defaults.tag !== undefined) input.tag = defaults.tag;
    if (defaults.ctx !== undefined) input.ctx = defaults.ctx;
    if (data !== undefined) input.data = data;
    if (extra) Object.assign(input, extra);
    return smartLog(input);
  };

  return {
    trace: (event: string, msg?: string, data?: SmartLogData, extra?: Partial<SmartLogInput>) => base('trace', event, msg, data, extra),
    debug: (event: string, msg?: string, data?: SmartLogData, extra?: Partial<SmartLogInput>) => base('debug', event, msg, data, extra),
    info: (event: string, msg?: string, data?: SmartLogData, extra?: Partial<SmartLogInput>) => base('info', event, msg, data, extra),
    warn: (event: string, msg?: string, data?: SmartLogData, extra?: Partial<SmartLogInput>) => base('warn', event, msg, data, extra),
    error: (event: string, msg?: string, data?: SmartLogData, extra?: Partial<SmartLogInput>) => base('error', event, msg, data, extra),
    fatal: (event: string, msg?: string, data?: SmartLogData, extra?: Partial<SmartLogInput>) => base('fatal', event, msg, data, extra)
  };
}

export async function traceSmartOp<T>(input: SmartTraceOpInput, run: () => Promise<T> | T): Promise<T> {
  const started = performance.now();
  const start = await smartLog({ ...input, event: input.startEvent ?? `${input.op}.start`, msg: input.msg ?? input.op, sample: false });

  try {
    const result = await run();
    const totalMs = Math.round(performance.now() - started);
    await smartLog({
      ...input,
      event: input.endEvent ?? `${input.op}.end`,
      msg: 'ok',
      trace: { sid: start.event.sid, rid: start.event.rid, p: start.event.span },
      data: { ...input.data, op: input.op, outcome: 'ok', totalMs },
      sample: false
    });
    return result;
  } catch (error) {
    const totalMs = Math.round(performance.now() - started);
    await smartLog({
      ...input,
      level: 'error',
      event: `${input.op}.error`,
      msg: error instanceof Error ? error.message : 'error',
      trace: { sid: start.event.sid, rid: start.event.rid, p: start.event.span },
      data: { ...input.data, op: input.op, outcome: 'error', totalMs, error },
      sample: false
    });
    throw error;
  }
}

export const smartAppLog = createSmartLogger({ actor: 'App', kind: 'system', tag: 'APP' });
export const smartPanelLog = createSmartLogger({ actor: 'Panel', kind: 'panel', tag: 'PAN' });
export const smartStateLog = createSmartLogger({ actor: 'State', kind: 'state', tag: 'STA' });
export const smartAgentLog = createSmartLogger({ actor: 'Agent', kind: 'agent', tag: 'AGT' });

export async function logBootOk(msg = 'boot ok', data?: SmartLogData): Promise<SmartLogWriteResult> {
  const input: SmartLogInput = { kind: 'boot', tag: 'BOT', actor: 'Core', event: 'boot.ok', msg, sample: false };
  if (data !== undefined) input.data = data;
  return smartLog(input);
}

export async function logBootErr(msg = 'boot err', data?: SmartLogData): Promise<SmartLogWriteResult> {
  const input: SmartLogInput = { kind: 'boot', tag: 'BOT', actor: 'Core', event: 'boot.err', level: 'error', msg, sample: false };
  if (data !== undefined) input.data = data;
  return smartLog(input);
}
