import { BLOCK_ID, BLOCK_VERSION, runExampleBlock } from './index';

export function gateExampleBlock(): void {
  if (BLOCK_ID !== 'template.example-block') {
    throw new Error('invalid block id');
  }

  if (!/^\d+\.\d+\.\d+$/.test(BLOCK_VERSION)) {
    throw new Error('invalid block version');
  }

  const result = runExampleBlock({ requestId: 'gate' });
  if (!result.ok) {
    throw new Error('block gate failed');
  }
}
