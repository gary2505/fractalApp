import fs from 'node:fs';
import path from 'node:path';
import { fail, ok, read, root } from './lib.mjs';

for (const file of ['src/core/bind/intent.ts', 'src/core/bind/patch.ts', 'src/wf/rl/bind.ts', 'src/wf/settings/bind.ts']) {
  if (!fs.existsSync(path.join(root, file))) fail(`missing ${file}`);
}

const rlBind = read(path.join(root, 'src/wf/rl/bind.ts'));
for (const id of ['bind.intent.recv', 'bind.patch.ok', 'bind.audit.ok']) {
  if (!rlBind.includes(id)) fail(`missing binding log ${id}`);
}
const settingsCmp = read(path.join(root, 'cmp/settings/1.0.1/index.html'));
for (const text of ['settings.apply', 'settings_apply_intent', 'bridge.invoke']) {
  if (!settingsCmp.includes(text)) fail(`settings template missing ${text}`);
}

ok('gate:bind ok');
