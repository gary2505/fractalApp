import { bridgeInvoke } from '../bridge/bridge';
import { readLastLogs } from './log';
import { readSmartLogMemory } from './smart-log-buffer';
import { SMART_LOG_LIMITS } from './smart-log-config';
import type { SmartLogEvent, SmartLogReadFile } from './smart-log-types';

export async function readSmartLogs(file: SmartLogReadFile = 'app', limit = 200): Promise<SmartLogEvent[]> {
  const safeLimit = Math.max(1, Math.min(limit, SMART_LOG_LIMITS.readLimit));

  try {
    return await bridgeInvoke('smart_log_read_last', { file, limit: safeLimit });
  } catch {
    if (file === 'app') {
      try {
        const legacy = await readLastLogs(safeLimit);
        return legacy
          .map((row) => row.data)
          .filter((item): item is SmartLogEvent => Boolean(item && typeof item === 'object' && (item as SmartLogEvent).v === 1));
      } catch {
        return readSmartLogMemory(safeLimit);
      }
    }
    return readSmartLogMemory(safeLimit).filter((row) => (file === 'issue' ? row.mode === 'issue' : row.l === 'error' || row.l === 'fatal'));
  }
}

export async function clearSmartLogs(file: SmartLogReadFile): Promise<boolean> {
  try {
    await bridgeInvoke('smart_log_clear', { file });
    return true;
  } catch {
    return false;
  }
}

export async function getSmartLogDir(): Promise<string | null> {
  try {
    return await bridgeInvoke('smart_log_dir', {});
  } catch {
    return null;
  }
}
