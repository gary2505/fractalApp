import { setCoreState } from '../state/state';
import { logAppError } from '../log/smart-log-app-flow';

export type SafeReason = {
  code: string;
  message: string;
};

export async function openSafeMode(reason: SafeReason): Promise<void> {
  setCoreState('SAFE_MODE');
  // 🔍 SEARCH: smart_log_run_event compact pipe row only
  void logAppError(`E_SAFE_${reason.code}`);
}
