import fs from 'node:fs';
import path from 'node:path';
import { fail, ok, root } from './lib.mjs';

const required = [
  'src/core/boot/boot.ts',
  'src/core/state/state.ts',
  'src/core/safe/safe.ts',
  'src/core/crash/crash.ts',
  'src/core/bridge/bridge.ts',
  'src/core/policy/policy.ts',
  'src/core/bind/intent.ts',
  'src/core/checkpoint/checkpoint.ts',
  'src/core/perm/perm.ts',
  'src/core/mf/manifest.ts',
  'src/core/cmp/cmp.ts',
  'src/core/update/update.ts',
  'src/core/rollback/rollback.ts',
  'src/core/health/health.ts',
  'src/core/recovery/recovery.ts',
  'src/core/log/log.ts',
  'src/core/sess/session.ts',
  'src/core/set/settings.ts',
  'src/core/theme/theme.ts',
  'src/core/i18n/i18n.ts',
  'src/wf/rl/restore.ts',
  'src/wf/rl/save.ts',
  'cmp/welcome/1.0.0/index.html',
  'mf/active.json',
  '.ai/idx/term.json',
  'docs/BASELINE.md'
];

const missing = required.filter((rel) => !fs.existsSync(path.join(root, rel)));
if (missing.length) fail(`baseline missing files:\n${missing.join('\n')}`);
ok('gate:base ok');
