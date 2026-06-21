import path from 'node:path';
import { fail, ok, read, root, walk } from './lib.mjs';

const files = walk(path.join(root, 'src')).filter((file) => /\.(ts|svelte)$/.test(file));
const tooLarge = [];
for (const file of files) {
  const rel = path.relative(root, file).replaceAll('\\', '/');
  const limit = rel.endsWith('.svelte') ? 220 : 180;
  const count = read(file).split('\n').length;
  if (count > limit) tooLarge.push(`${rel}: ${count}`);
}
if (tooLarge.length) fail(`large files:\n${tooLarge.join('\n')}`);
ok('gate:ctx ok');
