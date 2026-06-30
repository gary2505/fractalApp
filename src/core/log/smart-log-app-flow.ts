import {
  beginSmartUserAction,
  logBootErr,
  logBootOk,
  smartLog
} from './smart-log';

import type { SmartLogData, SmartTrace } from './smart-log-types';

type SmartActionTrace = Pick<SmartTrace, 'rid'>;
type PanelId = 'P0' | 'P1' | 'P3H2' | 'P4';

export function startSmartUiAction(prefix = 'ui'): SmartActionTrace {
  return { rid: beginSmartUserAction(prefix) };
}

export function logAppBootOk(data?: SmartLogData) {
  return logBootOk('app boot ok', data);
}

export function logAppBootErr(error: unknown, data?: SmartLogData) {
  const nextData: SmartLogData = { ...(data ?? {}), error: errorMessage(error) };
  return logBootErr('app boot err', nextData);
}

export function logMainVersionOpen(from: string, to: string, trace?: SmartActionTrace) {
  return smartLog({
    kind: 'ui',
    tag: 'UI',
    actor: 'App',
    event: 'version.open',
    msg: 'main version opened',
    data: { from, to },
    ...(trace ? { trace } : {}),
    sample: false
  });
}

export function logMainVersionActive(from: string, to: string, trace?: SmartActionTrace) {
  return smartLog({
    kind: 'state',
    tag: 'STA',
    actor: 'App',
    event: 'version.active',
    msg: 'active main version changed',
    data: { from, to },
    ...(trace ? { trace } : {}),
    sample: false
  });
}

export function logPanelToggle(panel: PanelId, data: SmartLogData, trace?: SmartActionTrace) {
  return smartLog({
    kind: 'panel',
    tag: 'PAN',
    actor: 'Main',
    event: `${panel.toLowerCase()}.toggle`,
    msg: `${panel} toggle`,
    data: { panel, ...data },
    ...(trace ? { trace } : {}),
    sample: false
  });
}

export function logIssueTraceSample(trace?: SmartActionTrace) {
  return smartLog({
    mode: 'issue',
    kind: 'trace',
    tag: 'TRC',
    actor: 'IssueTrace',
    event: 'issue.sample',
    msg: 'issue trace sample',
    data: { enabledByDefault: false },
    ...(trace ? { trace } : {}),
    sample: false
  });
}

export function logHandledAppError(actor: string, error: unknown, data?: SmartLogData, trace?: SmartActionTrace) {
  return smartLog({
    kind: 'error',
    tag: 'ERR',
    actor,
    level: 'error',
    event: 'error.handled',
    msg: errorMessage(error),
    ...(data !== undefined ? { data } : {}),
    ...(trace ? { trace } : {}),
    sample: false
  });
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}
