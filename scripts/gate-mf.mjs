import fs from 'node:fs';
import path from 'node:path';
import { fail, ok, root } from './lib.mjs';

for (const name of ['active.json', 'prev.json', 'candidate.json', 'verified.json']) {
  const file = path.join(root, 'mf', name);
  if (!fs.existsSync(file)) fail(`missing mf/${name}`);
  const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (parsed.schema !== 1 || typeof parsed.components !== 'object') fail(`bad mf/${name}`);
}
ok('gate:mf ok');
