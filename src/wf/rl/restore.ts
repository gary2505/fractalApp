import { loadSess } from './load';

export function validatePath(path: string | null): string | null {
  if (!path) return null;
  if (path.includes('\0')) return null;
  return path.trim().length > 0 ? path : null;
}

export async function restorePath(): Promise<string | null> {
  const session = await loadSess();
  return validatePath(session.lastPath);
}
