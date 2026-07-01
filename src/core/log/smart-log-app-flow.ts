import { bridgeInvoke } from '../bridge/bridge';

// 🔍 SEARCH: SmartLog v2 pipe format — plain text rows only.
// CRITICAL for next agent: Never add top-level time/id/level/msg/data fields.
// Never add traceId/workflowId/componentId/sessionId to app-run events.
// Never nest duplicated event objects in data.

type PanelId = 'P0' | 'P1' | 'P3H2' | 'P4';

function runEvent(ev: string, value?: Record<string, unknown> | string | number | boolean) {
  return bridgeInvoke<void>('smart_log_run_event', { ev, value: value ?? null });
}

// BT = boot (writes header + AP|BT after main version known)
export function logAppBoot(mainVersion: string, mode: 'dev' | 'prod') {
  return runEvent('BT', { main: mainVersion, mode });
}

// EN = end (writes AP|EN only from cleanup path)
export function logAppRunEnd() {
  return runEvent('EN');
}

// P0, P1, TM, AI = UI toggle events
export function logPanelToggle(panel: PanelId, open: boolean) {
  const code = panel === 'P0' ? 'P0' : panel === 'P1' ? 'P1' : panel === 'P3H2' ? 'TM' : 'AI';
  return runEvent(code, open ? 1 : 0);
}

// ER = error (writes AP|ER||{errorId})
export function logAppError(errorId: string) {
  return runEvent('err', errorId);
}

// FA = fatal (writes AP|FA||{errorId})
export function logAppFatal(errorId: string) {
  return runEvent('fatal', errorId);
}

// MV = main version change (writes AP|MV||{to})
export function logMainVersionChange(to: string) {
  return runEvent('main', { to });
}

// Keep issue trace for backwards compatibility
export function logIssueTraceSample() {
  return runEvent('trace', 'issue.sample');
}

// 🔍 SEARCH: recordSmartError — persistent deduped error via smart_log_error command.
// Levels: 'error' | 'critical' | 'fatal'
// CRITICAL for next agent: use only at real error paths, never for boot/toggles/UI.
export function recordSmartError(
  level: 'error' | 'critical' | 'fatal',
  errorId: string,
  whereCode: string,
  msg: string,
  file?: string,
  line?: number,
) {
  return bridgeInvoke<void>('smart_log_error', {
    level,
    errorId,
    whereCode,
    msg,
    file: file ?? null,
    line: line ?? null,
  });
}
