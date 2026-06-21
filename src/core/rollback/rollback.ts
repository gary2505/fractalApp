import { bridgeInvoke } from '../bridge/bridge';
import type { UpdateStep } from '../update/update';

export function restorePreviousActive(): Promise<UpdateStep> {
  return bridgeInvoke<UpdateStep>('rollback_restore_prev');
}
