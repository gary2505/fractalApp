import { writable } from 'svelte/store';
import { bridgeInvoke } from '../bridge/bridge';

export type CoreInfo = {
  app_name: string;
  version: string;
  app_data_dir: string;
  platform: string;
};

export const coreInfo = writable<CoreInfo | null>(null);

export function initCore(): Promise<CoreInfo> {
  return bridgeInvoke<CoreInfo>('init_app');
}

export function loadCoreInfo(): Promise<CoreInfo> {
  return bridgeInvoke<CoreInfo>('core_info');
}
