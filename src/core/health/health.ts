import { bridgeInvoke } from '../bridge/bridge';

export type HealthLevel = 'ok' | 'warn' | 'err';

export type HealthItem = {
  id: string;
  label: string;
  level: HealthLevel;
  message: string;
};

export type HealthReport = {
  ok: boolean;
  checkedAt: string;
  root: string;
  items: HealthItem[];
};

export function healthCheck() {
  return bridgeInvoke<HealthReport>('health_check');
}

export function repairAppData() {
  return bridgeInvoke<HealthReport>('recovery_repair');
}

export function resetManifest() {
  return bridgeInvoke<HealthReport>('recovery_reset_manifest');
}
