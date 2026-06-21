import { describe, expect, it } from 'vitest';
import { validatePath } from './restore';

describe('restore workflow', () => {
  it('accepts a normal path', () => {
    expect(validatePath('/tmp/fractal')).toBe('/tmp/fractal');
  });

  it('rejects empty and null paths', () => {
    expect(validatePath('')).toBeNull();
    expect(validatePath(null)).toBeNull();
  });

  it('rejects null bytes', () => {
    expect(validatePath('/bad\0path')).toBeNull();
  });
});
