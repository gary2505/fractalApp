import { enableIssueTrace, smartLog } from './smart-log';
import { makeId } from './smart-log-trace';
import type { SmartLogData, SmartLogKind, SmartLogTag } from './smart-log-types';

export type IssueTraceSession = {
  id: string;
  title: string;
  startedAt: string;
};

let activeIssue: IssueTraceSession | null = null;

export function currentIssueTrace(): IssueTraceSession | null {
  return activeIssue;
}

export async function startIssueTrace(title: string, data?: SmartLogData): Promise<IssueTraceSession> {
  enableIssueTrace(true);
  activeIssue = {
    id: makeId('i'),
    title,
    startedAt: new Date().toISOString()
  };

  await smartLog({
    mode: 'issue',
    kind: 'trace',
    tag: 'TRC',
    actor: 'IssueTrace',
    event: 'issue.start',
    msg: title,
    data: { issueId: activeIssue.id, ...data },
    sample: false
  });

  return activeIssue;
}

export async function stopIssueTrace(data?: SmartLogData): Promise<void> {
  if (!activeIssue) {
    enableIssueTrace(false);
    return;
  }

  await smartLog({
    mode: 'issue',
    kind: 'trace',
    tag: 'TRC',
    actor: 'IssueTrace',
    event: 'issue.end',
    msg: activeIssue.title,
    data: { issueId: activeIssue.id, ...data },
    sample: false
  });

  activeIssue = null;
  enableIssueTrace(false);
}

export async function issueLog(
  actor: string,
  event: string,
  note: string,
  data?: SmartLogData,
  kind: SmartLogKind = 'trace',
  tag: SmartLogTag = 'TRC'
): Promise<void> {
  if (!activeIssue) return;

  await smartLog({
    mode: 'issue',
    level: 'debug',
    kind,
    tag,
    actor,
    event,
    msg: note,
    data: { issueId: activeIssue.id, ...data },
    sample: false
  });
}

export async function issueTemp(id: string, actor: string, event: string, pathOrCtx?: string, note?: string): Promise<void> {
  await issueLog(actor, event, note ?? `T:${id}`, { tempId: id, path: pathOrCtx });
}

export async function issueMonitor(id: string, actor: string, event: string, data?: SmartLogData): Promise<void> {
  await issueLog(actor, event, `M:${id}`, { monitorId: id, ...data });
}
