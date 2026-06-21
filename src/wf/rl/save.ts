import { saveSession } from '../../core/sess/session';

export async function saveSess(lastPath: string | null): Promise<void> {
  await saveSession({
    lastPath,
    updatedAt: new Date().toISOString()
  });
}
