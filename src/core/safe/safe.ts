import { setCoreState } from '../state/state';
import { writeLog } from '../log/log';

export type SafeReason = {
  code: string;
  message: string;
};

export async function openSafeMode(reason: SafeReason): Promise<void> {
  setCoreState('SAFE_MODE');
  await writeLog({
    id: 'core.boot.err',
    level: 'warn',
    componentId: 'core',
    msg: reason.message,
    data: reason
  });
}
