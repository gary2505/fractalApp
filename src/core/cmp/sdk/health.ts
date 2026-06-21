import type { ComponentHealth } from './types';

export function makeHealth(startedAt: number, errors: string[] = []): ComponentHealth {
  return {
    ok: errors.length === 0,
    startupMs: Math.max(0, Math.round(performance.now() - startedAt)),
    loaded: true,
    rendered: document.body.childElementCount > 0,
    bridgeConnected: true,
    permissionsValid: true,
    errors,
  };
}

export function publishHealth(health: ComponentHealth): void {
  window.parent.postMessage({ kind: 'health.ready', health }, '*');
}
