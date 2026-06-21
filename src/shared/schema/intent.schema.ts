export type IntentSource = 'user' | 'ai' | 'system';

export type IntentSchema<T = unknown> = {
  id: string;
  type: string;
  source: IntentSource;
  componentId: string;
  workflowId: string;
  traceId: string;
  payload: T;
};

export function isIntent(value: unknown): value is IntentSchema {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === 'string' &&
    typeof item.type === 'string' &&
    ['user', 'ai', 'system'].includes(String(item.source)) &&
    typeof item.componentId === 'string' &&
    typeof item.workflowId === 'string' &&
    typeof item.traceId === 'string'
  );
}
