import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const required = [
  'docs/AI-AGENT-CHAT.md',
  'docs/AI-AGENT-CHAT-BLOCKS.md',
  'docs/AI-AGENT-CHAT-TOKEN-BUDGET.md',
  'docs/AI-AGENT-CHAT-PARALLEL-AGENTS.md',
  'docs/AI-AGENT-CHAT-SAFETY.md',
  'apps/ai-agent-chat/app.manifest.json',
  'apps/ai-agent-chat/app.ts',
  'apps/ai-agent-chat/app-state.schema.json',
  'apps/ai-agent-chat/messages/messages.en.json',
  'apps/ai-agent-chat/messages/messages.ru.json',
  'apps/ai-agent-chat/hotkeys/default-hotkeys.json',
  'apps/ai-agent-chat/icons/icons.json'
];

const blocks = [
  'chat-popup',
  'context-gate',
  'token-budget',
  'model-router',
  'parallel-runner',
  'patch-planner',
  'patch-review',
  'gate-runner',
  'error-memory',
  'rule-improvement-proposals'
];

for (const block of blocks) {
  required.push(`apps/ai-agent-chat/blocks/${block}/block.manifest.json`);
  required.push(`apps/ai-agent-chat/blocks/${block}/index.ts`);
}

const missing = required.filter((file) => !existsSync(join(root, file)));
if (missing.length) {
  console.error('[gate:ai-agent-chat] missing files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const appManifest = JSON.parse(readFileSync(join(root, 'apps/ai-agent-chat/app.manifest.json'), 'utf8'));
if (appManifest.id !== 'ai-agent-chat') {
  console.error('[gate:ai-agent-chat] app manifest id must be ai-agent-chat');
  process.exit(1);
}

if (!Array.isArray(appManifest.blocks) || appManifest.blocks.length !== blocks.length) {
  console.error('[gate:ai-agent-chat] app manifest must list all blocks');
  process.exit(1);
}

for (const block of blocks) {
  const manifestPath = join(root, `apps/ai-agent-chat/blocks/${block}/block.manifest.json`);
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (manifest.id !== `ai-agent-chat.${block}`) {
    console.error(`[gate:ai-agent-chat] wrong block id for ${block}`);
    process.exit(1);
  }
  if (manifest.fractalApp !== 'ai-agent-chat') {
    console.error(`[gate:ai-agent-chat] wrong fractalApp for ${block}`);
    process.exit(1);
  }
  if (!Array.isArray(manifest.permissions) || manifest.permissions.length !== 0) {
    console.error(`[gate:ai-agent-chat] skeleton block permissions must be empty for ${block}`);
    process.exit(1);
  }
}

console.log('[gate:ai-agent-chat] ok');
