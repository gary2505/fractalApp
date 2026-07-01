import { bridgeInvoke } from '../bridge/bridge';

// 🔍 SEARCH: SmartLog v2 compact run event (array rows only)
// CRITICAL for next agent: Never add top-level time/id/level/msg/data fields.
// Never add traceId/workflowId/componentId/sessionId to app-run events.
// Never nest duplicated event objects in data.

type PanelId = 'P0' | 'P1' | 'P3H2' | 'P4';

function runEvent(ev: string, value?: Record<string, unknown> | string | number | boolean) {
  return bridgeInvoke<void>('smart_log_run_event', { ev, value: value ?? null });
}

export function logAppBoot(mainVersion: string, mode: 'dev' | 'prod') {
  return runEvent('boot', { main: mainVersion, mode });
}

export function logAppRunEnd() {
  return runEvent('end');
}

export function logPanelToggle(panel: PanelId, open: boolean) {
  const code = panel === 'P0' ? 'p0' : panel === 'P1' ? 'p1' : panel === 'P3H2' ? 'term' : 'ai';
  return runEvent(code, open ? 1 : 0);
}

export function logMainVersionChange(to: string) {
  return runEvent('main', { to });
}

export function logAppError(errorId: string) {
  return runEvent('err', errorId);
}

export function logAppFatal(errorId: string) {
  return runEvent('fatal', errorId);
}

// Keep issue trace for backwards compatibility
export function logIssueTraceSample() {
  return runEvent('trace', 'issue.sample');
}
