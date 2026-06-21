import { spawnSync } from 'node:child_process';

const steps = [
  ['node', ['scripts/idx-build.mjs']],
  ['node', ['scripts/gate-base.mjs']],
  ['node', ['scripts/gate-arch.mjs']],
  ['node', ['scripts/gate-ctx.mjs']],
  ['node', ['scripts/gate-log.mjs']],
  ['node', ['scripts/gate-mf.mjs']],
  ['node', ['scripts/gate-policy.mjs']],
  ['node', ['scripts/gate-bind.mjs']],
  ['node', ['scripts/gate-patch.mjs']],
  ['node', ['scripts/gate-cmp.mjs']]
];

for (const [cmd, args] of steps) {
  const result = spawnSync(cmd, args, { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
console.log('smoke ok');
