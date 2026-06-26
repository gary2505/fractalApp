/**
 * Minimal fractalApp logger shim.
 * Keeps FilesUP window utilities decoupled from console calls in UI code.
 */
type LogPayload = unknown;

type DebugLogger = {
  debug(scope: string, action: string, message: string, data?: LogPayload): void;
  info(scope: string, action: string, message: string, data?: LogPayload): void;
  warn(scope: string, action: string, message: string, data?: LogPayload): void;
  error(scope: string, action: string, message: string, data?: LogPayload): void;
};

type ComponentLogger = {
  debug(message: string, data?: LogPayload): void;
  info(message: string, data?: LogPayload): void;
  warn(message: string, data?: LogPayload): void;
  error(message: string, data?: LogPayload): void;
};

function write(level: 'debug' | 'info' | 'warn' | 'error', label: string, message: string, data?: LogPayload): void {
  const line = `[${label}] ${message}`;

  if (data === undefined) {
    console[level](line);
    return;
  }

  console[level](line, data);
}

export function createDebugLogger(component: string): DebugLogger {
  return {
    debug: (scope, action, message, data) => write('debug', `${component}:${scope}:${action}`, message, data),
    info: (scope, action, message, data) => write('info', `${component}:${scope}:${action}`, message, data),
    warn: (scope, action, message, data) => write('warn', `${component}:${scope}:${action}`, message, data),
    error: (scope, action, message, data) => write('error', `${component}:${scope}:${action}`, message, data)
  };
}

export function createComponentLogger(component: string): ComponentLogger {
  return {
    debug: (message, data) => write('debug', component, message, data),
    info: (message, data) => write('info', component, message, data),
    warn: (message, data) => write('warn', component, message, data),
    error: (message, data) => write('error', component, message, data)
  };
}
