import { uiMotion } from './design-tokens';

export type UiMotionTrigger = 'pointer' | 'keyboard' | 'system' | 'critical';

export function shouldAnimateUi(trigger: UiMotionTrigger): boolean {
  return trigger === 'pointer';
}

export function clampUiMotionDuration(ms: number): number {
  if (!Number.isFinite(ms) || ms <= 0) return uiMotion.normalMs;
  return Math.min(ms, uiMotion.hardCapMs);
}

export function uiTransition(property = 'all', durationMs = uiMotion.normalMs): string {
  const safeDuration = clampUiMotionDuration(durationMs);
  return `${property} ${safeDuration}ms ${uiMotion.easeOut}`;
}

export function uiInstantWhenKeyboard(trigger: UiMotionTrigger, durationMs = uiMotion.normalMs): number {
  return shouldAnimateUi(trigger) ? clampUiMotionDuration(durationMs) : 0;
}
