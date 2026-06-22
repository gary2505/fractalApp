export const BLOCK_ID = 'template.example-block';
export const BLOCK_VERSION = '0.1.0';

export type BlockRunInput = {
  readonly requestId: string;
};

export type BlockRunResult = {
  readonly ok: true;
  readonly blockId: string;
  readonly version: string;
};

export function runExampleBlock(input: BlockRunInput): BlockRunResult {
  if (!input.requestId.trim()) {
    throw new Error('requestId is required');
  }

  return {
    ok: true,
    blockId: BLOCK_ID,
    version: BLOCK_VERSION,
  };
}
