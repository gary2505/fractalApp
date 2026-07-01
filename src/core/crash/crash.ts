import { setCoreState } from '../state/state';
import { logAppFatal } from '../log/smart-log-app-flow';

export type CrashReason = {
  code: string;
  message: string;
};

export async function openCrashScreen(reason: CrashReason): Promise<void> {
  setCoreState('CRASH');
  // 🔍 SEARCH: smart_log_run_event compact pipe row only
  void logAppFatal(`F_CRASH_${reason.code}`);
}
