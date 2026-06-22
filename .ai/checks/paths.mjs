#!/usr/bin/env node
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.argv[2] || process.cwd();
const errors = [];
const skip = new Set(['.git', 'node_modules', 'dist', 'build', '.svelte-kit', 'target']);

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (skip.has(name)) continue;
    const path = join(dir, name);
    const rel = relative(root, path).replaceAll('\\\\', '/');
    const st = statSync(path);

    if (rel.startsWith('src/shared/system/')) errors.push(`use src/system, not ${rel}`);
    if (rel.startsWith('.ai/recipes/')) errors.push(`move feature plans to plan/: ${rel}`);
    if (/src\/[^/]+\/[^/]*session[^/]*\/[^/]*store/i.test(rel)) {
      errors.push(`shorten store path, e.g. src/<feature>/store.ts: ${rel}`);
    }

    if (st.isDirectory()) walk(path);
  }
}

walk(root);

if (!existsSync(join(root, '.ai/start.md'))) errors.push('missing .ai/start.md');
if (!existsSync(join(root, '.ai/idx/map.md'))) errors.push('missing .ai/idx/map.md');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('paths ok');
