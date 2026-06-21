import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const requiredFiles = [
  'docs/UI-SYSTEM.md',
  'docs/DESIGN-TOKENS.md',
  'docs/MOTION-RULES.md',
  'docs/PREMIUM-UI-RULES.md',
  'docs/UI-AI-AGENT-RULES.md',
  'src/shared/design/design-tokens.ts',
  'src/shared/design/motion.ts',
  'src/shared/icons/icon-registry.ts',
  'src/shared/messages/message-registry.ts',
  'src/shared/hotkeys/hotkey-registry.ts',
  'src/shared/input/click-intent-service.ts',
  'src/shared/ui/index.ts',
];

const forbiddenPatterns = [
  { pattern: /TODO/i, reason: 'placeholder TODO is not allowed in UI foundation files' },
  { pattern: /z-index\s*:\s*\d+/i, reason: 'raw z-index values are not allowed; use uiZIndex tokens' },
  { pattern: /#[0-9a-f]{3,8}\b/i, reason: 'raw hex colors are not allowed; use theme tokens' },
];

function walk(dir) {
  if (!existsSync(dir)) return [];
  const result = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) result.push(...walk(path));
    else result.push(path);
  }
  return result;
}

const missing = requiredFiles.filter((file) => !existsSync(file));
if (missing.length > 0) {
  console.error('gate:ui-system failed. Missing files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const checkedFiles = [
  ...walk('docs').filter((file) => /UI|DESIGN|MOTION|PREMIUM/.test(file)),
  ...walk('src/shared/design'),
  ...walk('src/shared/icons'),
  ...walk('src/shared/messages'),
  ...walk('src/shared/hotkeys'),
  ...walk('src/shared/input'),
  ...walk('src/shared/ui'),
];

for (const file of checkedFiles) {
  const text = readFileSync(file, 'utf8');
  for (const rule of forbiddenPatterns) {
    if (rule.pattern.test(text)) {
      console.error(`gate:ui-system failed in ${file}: ${rule.reason}`);
      process.exit(1);
    }
  }
}

console.log('gate:ui-system passed');
