import { setCoreState } from '../state/state';
import { writeLog } from '../log/log';

export type CrashReason = {
  code: string;
  message: string;
};

export async function openCrashScreen(reason: CrashReason): Promise<void> {
  setCoreState('CRASH');
  await writeLog({
    id: 'core.boot.err',
    level: 'error',
    componentId: 'core',
    msg: reason.message,
    data: reason
  });
}
