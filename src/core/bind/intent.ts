export type IntentSource = 'user' | 'ai' | 'system';

export type Intent<T = unknown> = {
  id: string;
  type: string;
  source: IntentSource;
  componentId: string;
  workflowId: string;
  traceId: string;
  payload: T;
};

export function makeTraceId(prefix = 'T'): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
