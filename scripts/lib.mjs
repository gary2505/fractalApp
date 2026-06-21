import fs from 'node:fs';
import path from 'node:path';

export const root = process.cwd();

export function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const item of fs.readdirSync(dir)) {
    if (['node_modules', 'target', 'dist', '.git'].includes(item)) continue;
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

export function read(file) {
  return fs.readFileSync(file, 'utf8');
}

export function fail(message) {
  console.error(message);
  process.exit(1);
}

export function ok(message) {
  console.log(message);
}
