#!/usr/bin/env node
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.argv[2] || process.cwd();
const skip = new Set(['.git', 'node_modules', 'dist', 'build', '.svelte-kit', 'target']);
const maxPart = 32;
const maxPath = 140;
const errors = [];

function hasRepeatedPart(name) {
  const base = name.replace(/\.[^.]+$/, '');
  const parts = base.toLowerCase().split(/[-_]+/).filter(Boolean);
  for (let i = 1; i < parts.length; i += 1) {
    if (parts[i].length > 2 && parts[i] === parts[i - 1]) return true;
  }
  return false;
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (skip.has(name)) continue;
    const path = join(dir, name);
    const rel = relative(root, path).replaceAll('\\\\', '/');
    const st = statSync(path);

    if (name.length > maxPart) errors.push(`name too long: ${rel}`);
    if (rel.length > maxPath) errors.push(`path too long: ${rel}`);
    if (hasRepeatedPart(name)) errors.push(`repeated word: ${rel}`);
    if (/foundation-from-filesup/i.test(name)) errors.push(`history name: ${rel}`);

    if (st.isDirectory()) walk(path);
  }
}

walk(root);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('names ok');
