import { describe, expect, it } from 'vitest';
import { canRecover } from './state';

describe('core state', () => {
  it('marks rollback as recoverable', () => {
    expect(canRecover('ROLLBACK')).toBe(true);
  });

  it('does not mark running as recoverable', () => {
    expect(canRecover('RUNNING')).toBe(false);
  });
});
