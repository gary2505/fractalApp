import { createLogger } from './logger';

const logger = createLogger('safety-net');

export interface SafetyNetNotifyPayload {
  messageKey: string;
  level: 'warn' | 'error';
  error?: unknown;
}

export interface SafetyNetOptions {
  notify?: (payload: SafetyNetNotifyPayload) => void;
  messageKey?: string;
  ignoreResizeObserverLoop?: boolean;
  preventDefault?: boolean;
}

let installed = false;
let removeListeners: (() => void) | null = null;

export function installGlobalSafetyNet(options: SafetyNetOptions = {}): void {
  if (installed || typeof window === 'undefined') return;

  const messageKey = options.messageKey ?? 'system.safety_net.unhandled_error';
  const ignoreResizeObserverLoop = options.ignoreResizeObserverLoop ?? true;
  const preventDefault = options.preventDefault ?? true;

  const onUnhandledRejection = (event: PromiseRejectionEvent) => {
    logger.error('boot', 'unhandledRejection', 'Unhandled promise rejection', event.reason);
    options.notify?.({ messageKey, level: 'error', error: event.reason });
    if (preventDefault) event.preventDefault();
  };

  const onError = (event: ErrorEvent) => {
    const message = event.message || event.error?.message || '';

    if (ignoreResizeObserverLoop && message.includes('ResizeObserver loop')) {
      if (preventDefault) event.preventDefault();
      return;
    }

    logger.error('boot', 'windowError', 'Unhandled window error', event.error, {
      message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });

    options.notify?.({ messageKey, level: 'error', error: event.error });
    if (preventDefault) event.preventDefault();
  };

  window.addEventListener('unhandledrejection', onUnhandledRejection);
  window.addEventListener('error', onError);

  removeListeners = () => {
    window.removeEventListener('unhandledrejection', onUnhandledRejection);
    window.removeEventListener('error', onError);
  };

  installed = true;
}

export function uninstallGlobalSafetyNet(): void {
  removeListeners?.();
  removeListeners = null;
  installed = false;
}

export function isSafetyNetInstalled(): boolean {
  return installed;
}
