export type StatePatchSchema<T = unknown> = {
  id: string;
  type: string;
  workflowId: string;
  traceId: string;
  beforeHash: string;
  afterHash: string;
  changes: T;
};

export function isStatePatch(value: unknown): value is StatePatchSchema {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === 'string' &&
    typeof item.type === 'string' &&
    typeof item.workflowId === 'string' &&
    typeof item.traceId === 'string' &&
    typeof item.beforeHash === 'string' &&
    typeof item.afterHash === 'string'
  );
}
