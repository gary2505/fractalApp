// 🔍 SEARCH: AI-agent-only debug logger — calls Rust llog_write, silent on error.
// CRITICAL for next agent: Only meaningful checkpoints. Never per-loop-item. Never health/status spam.
// CRITICAL for next agent: Temporary blocks must use /* LLOG-T:<id>:start */ / /* LLOG-T:<id>:end */ markers.
// CRITICAL for next agent: Monitor blocks must stay commented out: /* LLOG-M:<id>:start */ ... /* LLOG-M:<id>:end */

import { bridgeInvoke } from '../bridge/bridge';

export async function llog(
  component: string,
  event: string,
  path?: string,
  note?: string,
): Promise<void> {
  try {
    await bridgeInvoke<void>('llog_write', { component, event, path, note });
  } catch {
    // Silent — llog is AI-agent-only, never user-facing.
  }
}
