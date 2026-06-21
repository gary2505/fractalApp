import { bridgeInvoke } from '../bridge/bridge';

export type UpdateStep = {
  ok: boolean;
  message: string;
  activeVersion?: string;
  candidateVersion?: string;
};

export function prepareLocalCandidate(): Promise<UpdateStep> {
  return bridgeInvoke<UpdateStep>('update_prepare_local');
}

export function verifyCandidate(): Promise<UpdateStep> {
  return bridgeInvoke<UpdateStep>('update_verify_candidate');
}

export function switchVerified(): Promise<UpdateStep> {
  return bridgeInvoke<UpdateStep>('update_switch_verified');
}
