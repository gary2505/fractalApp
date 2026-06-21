import { writable } from 'svelte/store';

export type CoreState =
  | 'BOOT'
  | 'MF_LOAD'
  | 'MF_VALIDATE'
  | 'BRIDGE_INIT'
  | 'SESSION_LOAD'
  | 'CMP_LOAD'
  | 'RUNNING'
  | 'ROLLBACK'
  | 'SAFE_MODE'
  | 'CRASH';

export const coreState = writable<CoreState>('BOOT');

export function setCoreState(next: CoreState): void {
  coreState.set(next);
}

export function canRecover(state: CoreState): boolean {
  return state === 'ROLLBACK' || state === 'SAFE_MODE';
}
