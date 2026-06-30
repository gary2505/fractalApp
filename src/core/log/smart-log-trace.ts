import type { SmartTrace } from './smart-log-types';

const bootStart = Date.now();
const sessionId = makeId('s');
let activeRid = makeId('r');
let span = 0;

function randomPart(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID().slice(0, 8);
  }
  return Math.random().toString(36).slice(2, 10);
}

export function makeId(prefix: string): string {
  return `${prefix}${Date.now().toString(36)}${randomPart()}`;
}

export function smartBootMs(): number {
  return Date.now() - bootStart;
}

export function smartBootT(): string {
  const ms = smartBootMs();
  return ms < 1000 ? `+${ms}ms` : `+${(ms / 1000).toFixed(1)}s`;
}

export function smartSessionId(): string {
  return sessionId;
}

export function startSmartRequest(prefix = 'r'): string {
  activeRid = makeId(prefix);
  span = 0;
  return activeRid;
}

export function currentSmartRequest(): string {
  return activeRid;
}

export function nextSmartTrace(input?: Partial<SmartTrace>): SmartTrace {
  const nextSpan = input?.span ?? span + 1;
  span = Math.max(span, nextSpan);
  return {
    sid: input?.sid ?? sessionId,
    rid: input?.rid ?? activeRid,
    span: nextSpan,
    p: input?.p
  };
}

export function childSmartTrace(parent: SmartTrace): SmartTrace {
  return nextSmartTrace({ sid: parent.sid, rid: parent.rid, p: parent.span });
}
