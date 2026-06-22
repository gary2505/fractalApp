#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'docs/FRACTAL-APP-CONTRACT.md',
  'docs/FRACTAL-APP-MANIFEST.md',
  'docs/FRACTAL-APP-PERMISSIONS.md',
  'docs/FRACTAL-APP-GATES.md',
  'apps/_template/app.manifest.json',
  'apps/_template/subproject-state.md',
  'apps/_template/index.ts',
  'apps/_template/blocks/_template-block/block.manifest.json',
  'apps/_template/blocks/_template-block/index.ts',
  'apps/_template/blocks/_template-block/gate.ts',
  'apps/_template/blocks/_template-block/ui/template-block.svelte',
  'apps/_template/messages/messages.en.json',
  'apps/_template/messages/messages.ru.json',
  'apps/_template/hotkeys/hotkeys.en.json',
  'apps/_template/hotkeys/hotkeys.ru.json',
  'apps/_template/tests/template-contract.test.md',
  'apps/_template/tests/gate-notes.md'
];

function fail(message) {
  console.error(`[gate:fractal-app-contract] failed`);
  console.error(message);
  process.exit(1);
}

function readJson(relPath) {
  const fullPath = path.join(root, relPath);
  try {
    return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  } catch (error) {
    fail(`invalid JSON: ${relPath}\n${error.message}`);
  }
}

for (const relPath of requiredFiles) {
  if (!fs.existsSync(path.join(root, relPath))) {
    fail(`missing file: ${relPath}`);
  }
}

const appManifest = readJson('apps/_template/app.manifest.json');
const blockManifest = readJson('apps/_template/blocks/_template-block/block.manifest.json');

const semver = /^\d+\.\d+\.\d+$/;

if (appManifest.type !== 'fractal-app') fail('apps/_template/app.manifest.json type must be fractal-app');
if (!semver.test(appManifest.version)) fail('apps/_template/app.manifest.json version must be semver');
if (!Array.isArray(appManifest.permissions)) fail('app permissions must be an array');
if (!Array.isArray(appManifest.blocks)) fail('app blocks must be an array');
if (!appManifest.messages?.en || !appManifest.messages?.ru) fail('app messages EN/RU paths are required');
if (!appManifest.hotkeys?.en || !appManifest.hotkeys?.ru) fail('app hotkeys EN/RU paths are required');
if (!Array.isArray(appManifest.gates)) fail('app gates must be an array');
if (!appManifest.rollback || typeof appManifest.rollback.enabled !== 'boolean') fail('app rollback policy is required');

if (blockManifest.type !== 'workflow-block') fail('block type must be workflow-block');
if (!semver.test(blockManifest.version)) fail('block version must be semver');
if (blockManifest.fractalApp !== appManifest.id) fail('block fractalApp must match app id');
if (!Array.isArray(blockManifest.permissions)) fail('block permissions must be an array');
if (!blockManifest.dependsOn?.corebridge) fail('block dependsOn.corebridge is required');
if (!blockManifest.dependsOn?.['ui-system']) fail('block dependsOn.ui-system is required');
if (!Array.isArray(blockManifest.gates)) fail('block gates must be an array');
if (!blockManifest.rollback || typeof blockManifest.rollback.enabled !== 'boolean') fail('block rollback policy is required');

console.log('[gate:fractal-app-contract] ok');
