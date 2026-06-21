import fs from 'node:fs';
import path from 'node:path';
import { root, walk, read } from './lib.mjs';

const src = path.join(root, 'src');
const files = walk(src).filter((file) => /\.(ts|svelte)$/.test(file));
const symbols = [];

for (const file of files) {
  const rel = path.relative(root, file).replaceAll('\\', '/');
  const lines = read(file).split('\n');
  lines.forEach((line, index) => {
    const match = line.match(/export\s+(async\s+)?function\s+(\w+)|export\s+const\s+(\w+)/);
    if (match) {
      symbols.push({ file: rel, line: index + 1, name: match[2] || match[3] });
    }
  });
}

const outDir = path.join(root, '.ai/idx');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'sym.json'), JSON.stringify({ generatedAt: new Date().toISOString(), symbols }, null, 2));
fs.writeFileSync(path.join(outDir, 'wf.json'), JSON.stringify({ workflows: [{ id: 'rl', path: 'src/wf/rl' }, { id: 'settings', path: 'src/wf/settings' }, { id: 'patch', path: 'src/core/patch' }, { id: 'cmp-template', path: 'cmp/_template/1.0.0' }] }, null, 2));
fs.writeFileSync(path.join(outDir, 'term.json'), JSON.stringify({ terms: { rl: 'reload workflow', cmp: 'component', sdk: 'component sdk', mf: 'manifest', bind: 'fractal binding', patch: 'unified diff patch' } }, null, 2));
const logText = read(path.join(root, 'src/core/log/log-ids.ts'));
const logs = [...logText.matchAll(/'([^']+)'/g)].map((m) => m[1]);
fs.writeFileSync(path.join(outDir, 'log.json'), JSON.stringify({ ids: logs }, null, 2));
console.log(`idx built: ${symbols.length} symbols`);
