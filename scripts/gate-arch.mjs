import path from 'node:path';
import { fail, ok, read, root, walk } from './lib.mjs';

const files = walk(path.join(root, 'src')).filter((file) => /\.(ts|svelte)$/.test(file));
const offenders = files.filter((file) => {
  const rel = path.relative(root, file).replaceAll('\\', '/');
  if (rel === 'src/core/bridge/bridge.ts') return false;
  return read(file).includes('@tauri-apps/api');
});
if (offenders.length) fail(`direct Tauri import outside bridge:\n${offenders.join('\n')}`);
ok('gate:arch ok');
