import { makeTraceId, type Intent } from '../../core/bind/intent';
import type { StatePatch } from '../../core/bind/patch';
import { saveSess } from './save';
import { restorePath, validatePath } from './restore';

export type ReloadIntentType = 'rl.path.save' | 'rl.path.restore';
export type ReloadPatch = StatePatch<{ lastPath: string | null }>;

export async function savePathIntent(rawPath: string): Promise<ReloadPatch> {
  const traceId = makeTraceId('RL');
  const intent = createIntent('rl.path.save', traceId, { rawPath });
  const lastPath = validatePath(rawPath);
  if (!lastPath) {
    throw new Error('Invalid path');
  }
  await saveSess(lastPath);
  const patch = makePatch('rl.path.saved', traceId, { lastPath });
  return patch;
}

export async function restorePathIntent(): Promise<ReloadPatch> {
  const traceId = makeTraceId('RL');
  const intent = createIntent('rl.path.restore', traceId, {});
  const lastPath = await restorePath();
  const patch = makePatch('rl.path.restored', traceId, { lastPath });
  return patch;
}

function createIntent(type: ReloadIntentType, traceId: string, payload: unknown): Intent {
  return { id: traceId, type, source: 'user', componentId: 'core', workflowId: 'rl', traceId, payload };
}

function makePatch(type: string, traceId: string, changes: { lastPath: string | null }): ReloadPatch {
  return { id: `${traceId}-patch`, type, workflowId: 'rl', traceId, beforeHash: 'na', afterHash: 'na', changes };
}
