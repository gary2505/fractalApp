import { bridgeInvoke } from '../bridge/bridge';

export type Session = {
  lastPath: string | null;
  updatedAt: string | null;
};

export function loadSession(): Promise<Session> {
  return bridgeInvoke<Session>('session_load');
}

export function saveSession(session: Session): Promise<void> {
  return bridgeInvoke<void>('session_save', { session });
}
