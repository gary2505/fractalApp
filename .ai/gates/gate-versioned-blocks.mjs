#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const required = [
  'docs/VERSIONED-BLOCKS.md',
  'docs/BLOCK-MANIFEST.md',
  'docs/BLOCK-NAMING.md',
  'docs/BLOCK-UPDATE-ROLLBACK.md',
  'docs/BLOCK-GATES.md',
  'docs/BLOCK-AI-PATCH-RULES.md',
  'apps/_template/blocks/_template/block.manifest.json',
  'apps/_template/blocks/_template/index.ts',
  'apps/_template/blocks/_template/gate.ts',
];

const missing = required.filter((file) => !existsSync(join(process.cwd(), file)));
if (missing.length) {
  console.error('[gate:versioned-blocks] missing files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const manifestPath = join(process.cwd(), 'apps/_template/blocks/_template/block.manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

const requiredFields = [
  'id',
  'name',
  'version',
  'fractalApp',
  'type',
  'entry',
  'permissions',
  'dependsOn',
  'gates',
  'rollback',
];

for (const field of requiredFields) {
  if (!(field in manifest)) {
    console.error(`[gate:versioned-blocks] missing manifest field: ${field}`);
    process.exit(1);
  }
}

if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) {
  console.error('[gate:versioned-blocks] manifest version must be semver');
  process.exit(1);
}

if (!Array.isArray(manifest.permissions)) {
  console.error('[gate:versioned-blocks] permissions must be an array');
  process.exit(1);
}

if (!Array.isArray(manifest.gates) || manifest.gates.length === 0) {
  console.error('[gate:versioned-blocks] gates must be a non-empty array');
  process.exit(1);
}

if (!manifest.rollback || manifest.rollback.enabled !== true) {
  console.error('[gate:versioned-blocks] rollback.enabled must be true');
  process.exit(1);
}

console.log('[gate:versioned-blocks] ok');
