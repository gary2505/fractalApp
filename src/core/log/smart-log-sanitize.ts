import { SMART_LOG_LIMITS, SMART_LOG_REDACT_KEYS } from './smart-log-config';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function shouldRedact(key: string): boolean {
  const normalized = key.toLowerCase();
  return SMART_LOG_REDACT_KEYS.some((item) => normalized.includes(item.toLowerCase()));
}

function clip(value: string, max: number = SMART_LOG_LIMITS.maxString): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max)}…`;
}

function sanitizeError(error: Error): Record<string, unknown> {
  return {
    name: clip(error.name, 80),
    message: clip(error.message, SMART_LOG_LIMITS.maxMessage),
    stack: error.stack ? clip(error.stack, 1200) : undefined
  };
}

export function sanitizeMsg(msg: unknown): string {
  if (msg === undefined || msg === null) return '';
  return clip(String(msg).replace(/\s+/g, ' ').trim(), SMART_LOG_LIMITS.maxMessage);
}

export function sanitizeLogValue(value: unknown, depth = 0): unknown {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value === 'string') return clip(value);
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  if (typeof value === 'bigint') return value.toString();
  if (value instanceof Error) return sanitizeError(value);
  if (value instanceof Date) return value.toISOString();
  if (depth >= SMART_LOG_LIMITS.maxDataDepth) return '[depth]';

  if (Array.isArray(value)) {
    return value
      .slice(0, SMART_LOG_LIMITS.maxArrayItems)
      .map((item) => sanitizeLogValue(item, depth + 1));
  }

  if (isRecord(value)) {
    const result: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value).slice(0, SMART_LOG_LIMITS.maxObjectKeys)) {
      result[key] = shouldRedact(key) ? '[redacted]' : sanitizeLogValue(item, depth + 1);
    }
    return result;
  }

  return clip(String(value));
}

export function sanitizeObject(value: unknown): Record<string, unknown> | undefined {
  const sanitized = sanitizeLogValue(value);
  if (!sanitized || typeof sanitized !== 'object' || Array.isArray(sanitized)) return undefined;
  return sanitized as Record<string, unknown>;
}
