export type Checkpoint<T> = {
  name: string;
  value: T;
  createdAt: string;
};

export function createCheckpoint<T>(name: string, value: T): Checkpoint<T> {
  return { name, value, createdAt: new Date().toISOString() };
}

export function isCheckpoint(value: unknown): value is Checkpoint<unknown> {
  return typeof value === 'object' && value !== null && 'name' in value && 'value' in value;
}
