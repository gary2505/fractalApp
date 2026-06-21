// gate-block.mjs — block production checklist verification
// Runs key invariant checks without a full build.
// Covers: architecture, policy, binding, patch rules, log ID alignment.

import { execSync } from 'node:child_process';
import { fail, ok, read, root } from './lib.mjs';
import path from 'node:path';

const gates = ['gate:arch', 'gate:policy', 'gate:bind', 'gate:patch', 'gate:log'];

for (const gate of gates) {
  try {
    execSync(`pnpm ${gate}`, { cwd: root, stdio: 'pipe' });
  } catch {
    fail(`gate:block failed at ${gate}`);
  }
}

// Extra: verify key files exist
const required = [
  'docs/BLOCK-PRODUCTION-CHECKLIST.md',
  '.ai/idx/sym.json',
  '.ai/idx/log.json',
  '.ai/idx/term.json',
  '.ai/idx/wf.json',
  '.ai/golden/rl.jsonl',
  '.ai/patch/README.md',
  '.ai/giHub-link.md',
  'AGENTS.md',
  'src/core/bridge/bridge.ts',
  'src/core/policy/policy.ts',
  'src/core/log/log-ids.ts',
  'src-tauri/src/core.rs',
  'src-tauri/capabilities/default.json'
];

for (const file of required) {
  const full = path.join(root, file);
  try {
    read(full);
  } catch {
    fail(`gate:block missing required file: ${file}`);
  }
}

ok('gate:block ok');
