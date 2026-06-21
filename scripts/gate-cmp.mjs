import fs from 'node:fs';
import path from 'node:path';
import { fail, ok, read, root } from './lib.mjs';

const required = [
  'cmp/_template/1.0.0/index.html',
  'cmp/_template/1.0.0/manifest.json',
  'src/core/cmp/sdk/types.ts',
  'src/core/cmp/sdk/bridge-client.ts',
  'src/core/cmp/sdk/health.ts',
  'src/shared/schema/component.schema.ts',
  'scripts/cmp-new.mjs',
  'docs/COMPONENT-TEMPLATE.md'
];

for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) fail(`missing ${rel}`);
}

const html = read(path.join(root, 'cmp/_template/1.0.0/index.html'));
for (const text of ['health.ready', 'core-bridge', 'makeIntent']) {
  if (!html.includes(text)) fail(`component template missing ${text}`);
}

const sdk = read(path.join(root, 'src/core/cmp/sdk/bridge-client.ts'));
if (!sdk.includes('postMessage')) fail('SDK must use postMessage');
if (sdk.includes('@tauri-apps/api')) fail('SDK must not import Tauri');

ok('gate:cmp ok');
