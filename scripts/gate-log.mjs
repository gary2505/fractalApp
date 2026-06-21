import path from 'node:path';
import { fail, ok, read, root } from './lib.mjs';

const logText = read(path.join(root, 'src/core/log/log-ids.ts'));
const ids = [...logText.matchAll(/'([^']+)'/g)].map((m) => m[1]);
if (new Set(ids).size !== ids.length) fail('duplicate log IDs');
if (!ids.includes('core.boot.ok')) fail('missing core.boot.ok');
ok('gate:log ok');
