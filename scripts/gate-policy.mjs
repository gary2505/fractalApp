import path from 'node:path';
import { fail, ok, read, root } from './lib.mjs';

const bridge = read(path.join(root, 'src/core/bridge/bridge.ts'));
if (!bridge.includes('checkPolicy')) fail('bridge must call policy');
const policy = read(path.join(root, 'src/core/policy/policy.ts'));
if (!policy.includes('COMPONENT_COMMANDS')) fail('policy must define component allowlist');
ok('gate:policy ok');
