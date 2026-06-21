export type StatePatch<T = unknown> = {
  id: string;
  type: string;
  workflowId: string;
  traceId: string;
  beforeHash: string;
  afterHash: string;
  changes: T;
};
