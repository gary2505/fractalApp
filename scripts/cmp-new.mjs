import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { root } from './lib.mjs';

const id = process.argv[2];
const version = process.argv[3] ?? '1.0.0';

if (!id || !/^[a-z][a-z0-9-]*$/.test(id)) {
  console.error('usage: pnpm cmp:new <component-id> [version]');
  console.error('component-id must be kebab-case, example: explorer-panel');
  process.exit(1);
}

if (!/^\d+\.\d+\.\d+$/.test(version)) {
  console.error('version must use semver, example: 1.0.0');
  process.exit(1);
}

const templateDir = path.join(root, 'cmp/_template/1.0.0');
const targetDir = path.join(root, 'cmp', id, version);
if (fs.existsSync(targetDir)) {
  console.error(`component already exists: cmp/${id}/${version}`);
  process.exit(1);
}

const title = id
  .split('-')
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join(' ');

fs.mkdirSync(targetDir, { recursive: true });
const replacements = new Map([
  ['__COMPONENT_ID__', id],
  ['__COMPONENT_TITLE__', title],
  ['__WORKFLOW_ID__', id],
  ['__CREATED_AT__', new Date().toISOString()],
]);

let html = fs.readFileSync(path.join(templateDir, 'index.html'), 'utf8');
html = applyReplacements(html, replacements);
fs.writeFileSync(path.join(targetDir, 'index.html'), html);

let manifest = fs.readFileSync(path.join(templateDir, 'manifest.json'), 'utf8');
manifest = applyReplacements(manifest, replacements);
manifest = manifest.replaceAll('__SHA256__', sha256(html));
fs.writeFileSync(path.join(targetDir, 'manifest.json'), manifest);

console.log(`created cmp/${id}/${version}`);
console.log('next: add it to mf/active.json only when you want it active');

function applyReplacements(text, replacements) {
  let next = text;
  for (const [key, value] of replacements) next = next.replaceAll(key, value);
  return next;
}

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}
