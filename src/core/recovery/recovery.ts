import { repairAppData, resetManifest } from '../health/health';

export async function repairCoreStorage() {
  return repairAppData();
}

export async function resetCoreManifest() {
  return resetManifest();
}
