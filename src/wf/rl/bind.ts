import { makeTraceId, type Intent } from '../../core/bind/intent';
import type { StatePatch } from '../../core/bind/patch';
import { writeLog } from '../../core/log/log';
import { saveSess } from './save';
import { restorePath, validatePath } from './restore';

export type ReloadIntentType = 'rl.path.save' | 'rl.path.restore';
export type ReloadPatch = StatePatch<{ lastPath: string | null }>;

export async function savePathIntent(rawPath: string): Promise<ReloadPatch> {
  const traceId = makeTraceId('RL');
  const intent = createIntent('rl.path.save', traceId, { rawPath });
  await writeLog({ id: 'bind.intent.recv', level: 'info', traceId, workflowId: 'rl', msg: intent.type });
  const lastPath = validatePath(rawPath);
  if (!lastPath) {
    await writeLog({ id: 'bind.intent.block', level: 'warn', traceId, workflowId: 'rl', msg: 'invalid path' });
    throw new Error('Invalid path');
  }
  await saveSess(lastPath);
  await writeLog({ id: 'rl.sess.save.ok', level: 'info', traceId, workflowId: 'rl', msg: 'session path saved' });
  const patch = makePatch('rl.path.saved', traceId, { lastPath });
  await writeLog({ id: 'bind.patch.ok', level: 'info', traceId, workflowId: 'rl', msg: 'state patch created' });
  await writeLog({ id: 'bind.flow.ok', level: 'info', traceId, workflowId: 'rl', msg: 'save path flow completed' });
  await writeLog({ id: 'bind.audit.ok', level: 'info', traceId, workflowId: 'rl', msg: 'save path audited' });
  return patch;
}

export async function restorePathIntent(): Promise<ReloadPatch> {
  const traceId = makeTraceId('RL');
  const intent = createIntent('rl.path.restore', traceId, {});
  await writeLog({ id: 'bind.intent.recv', level: 'info', traceId, workflowId: 'rl', msg: intent.type });
  const lastPath = await restorePath();
  await writeLog({ id: 'rl.path.restore.ok', level: 'info', traceId, workflowId: 'rl', msg: 'session path restored' });
  const patch = makePatch('rl.path.restored', traceId, { lastPath });
  await writeLog({ id: 'bind.patch.ok', level: 'info', traceId, workflowId: 'rl', msg: 'state patch created' });
  await writeLog({ id: 'bind.render.ok', level: 'info', traceId, workflowId: 'rl', msg: 'restore path ready for render' });
  await writeLog({ id: 'bind.audit.ok', level: 'info', traceId, workflowId: 'rl', msg: 'restore path audited' });
  return patch;
}

function createIntent(type: ReloadIntentType, traceId: string, payload: unknown): Intent {
  return { id: traceId, type, source: 'user', componentId: 'core', workflowId: 'rl', traceId, payload };
}

function makePatch(type: string, traceId: string, changes: { lastPath: string | null }): ReloadPatch {
  return { id: `${traceId}-patch`, type, workflowId: 'rl', traceId, beforeHash: 'na', afterHash: 'na', changes };
}
