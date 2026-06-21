import fs from 'node:fs';
import path from 'node:path';
import { fail, ok, read, root } from './lib.mjs';

const rules = read('AGENTS.md');
for (const phrase of ['unified diff', 'One patch fixes one issue', 'Do not rewrite full files']) {
  if (!rules.includes(phrase)) fail(`missing patch rule: ${phrase}`);
}

for (const file of ['src/core/patch/patch.ts', '.ai/patch/README.md']) {
  if (!fs.existsSync(path.join(root, file))) fail(`missing ${file}`);
}

const patch = read(path.join(root, 'src/core/patch/patch.ts'));
if (!patch.includes('isUnifiedDiff')) fail('missing unified diff checker');

ok('gate:patch ok');
