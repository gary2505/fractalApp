import { describe, expect, it } from 'vitest';
import { sanitizeLogValue, sanitizeMsg } from './smart-log-sanitize';
import { childSmartTrace, nextSmartTrace } from './smart-log-trace';

describe('smart log sanitize', () => {
  it('clips long messages', () => {
    expect(sanitizeMsg('x'.repeat(200)).length).toBeLessThanOrEqual(121);
  });

  it('redacts secrets', () => {
    const value = sanitizeLogValue({ token: 'abc', safe: 'ok' }) as Record<string, unknown>;
    expect(value.token).toBe('[redacted]');
    expect(value.safe).toBe('ok');
  });
});

describe('smart log trace', () => {
  it('creates parent child spans', () => {
    const parent = nextSmartTrace({ rid: 'r-test', span: 1 });
    const child = childSmartTrace(parent);
    expect(child.rid).toBe('r-test');
    expect(child.p).toBe(1);
  });
});
